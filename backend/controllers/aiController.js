const axios = require("axios");
const {
  questionAnswerPrompt,
  conceptExplainPrompt,
} = require("../utils/prompt");

const apiKey = process.env.PERPLEXITY_API_KEY;
const apiHost = process.env.PERPLEXITY_API_HOST;

// Helper function to parse Q&A format
const parseQAFormat = (text) => {
  const questions = [];
  const lines = text.split('\n');
  let currentQ = null;
  let currentA = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue; // Skip empty lines
    
    // First try to match Q1:, Q2: format
    let qMatch = trimmed.match(/^Q\d+:\s*(.*)/i);
    if (!qMatch) {
      // Also try "1." or "1)" format (Perplexity format)
      qMatch = trimmed.match(/^[\d]+[\.\)]\s+(.+)/);
    }
    
    if (qMatch) {
      // Save previous Q&A if exists
      if (currentQ && currentA) {
        questions.push({
          question: currentQ.trim(),
          answer: currentA.trim()
        });
      }
      currentQ = qMatch[1];
      currentA = null;
      continue;
    }
    
    // Try to match A1:, A2: format
    let aMatch = trimmed.match(/^A\d+:\s*(.*)/i);
    
    // If no A match, check if this looks like it's starting an answer
    // (usually comes after a question and before the next numbered item)
    if (!aMatch && currentQ && !currentA) {
      // This line is likely the answer or part of it
      currentA = trimmed;
      continue;
    }
    
    if (aMatch) {
      currentA = (currentA || '') + (currentA ? ' ' : '') + aMatch[1];
      continue;
    }
    
    // If we have a question but no answer yet, this line is part of the question or start of answer
    if (currentQ && !currentA && !trimmed.match(/^[\d]+[\.\)]|^Q\d+:|^A\d+:/i)) {
      currentQ = currentQ + ' ' + trimmed;
    } 
    // If we have both Q and A, this line is part of the answer
    else if (currentA && !trimmed.match(/^[\d]+[\.\)]|^Q\d+:|^A\d+:/i)) {
      currentA = currentA + ' ' + trimmed;
    }
  }
  
  // Add last Q&A pair
  if (currentQ && currentA) {
    questions.push({
      question: currentQ.trim(),
      answer: currentA.trim()
    });
  }
  
  if (questions.length === 0) {
    throw new Error("No questions found in response");
  }
  
  return questions;
};

// Create axios instance for Perplexity API
const perplexityClient = axios.create({
  baseURL: "https://perplexity2.p.rapidapi.com",
  timeout: 60000,
  headers: {
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": apiHost,
    "Content-Type": "application/json",
  },
});

// Generate-Interview-Question

const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions)
      return res.status(400).json({ message: " missing required fields." });

    //getting prompt
    const prompt = questionAnswerPrompt(
      role,
      experience,
      topicsToFocus,
      numberOfQuestions
    );

    //generate response from Perplexity API
    const response = await perplexityClient.post("/", {
      content: prompt,
    });

    if (!response.data) {
      throw new Error("No response from Perplexity API");
    }

    // Check if Perplexity returned an error
    if (response.data.success === false || response.data.error) {
      const errorMsg = response.data.error?.message || "Perplexity API error";
      console.error("Perplexity API Error:", errorMsg);
      throw new Error(`Perplexity API failed: ${errorMsg}`);
    }

    let rawText = response.data;
    
    // Handle different response formats from Perplexity
    if (typeof rawText === "string") {
      // Already a string, good to go
    } else if (typeof rawText === "object") {
      // Try multiple extraction paths
      if (rawText.content && typeof rawText.content === "string") {
        rawText = rawText.content;
      } else if (rawText.choices) {
        // Handle if choices is an array
        if (Array.isArray(rawText.choices) && rawText.choices[0]) {
          rawText = rawText.choices[0].message?.content || rawText.choices[0].text;
        } 
        // Handle if choices is an object with content.parts (Google Gemini format)
        else if (typeof rawText.choices === "object" && rawText.choices.content) {
          const content = rawText.choices.content;
          if (content.parts && Array.isArray(content.parts)) {
            // Extract text from parts array - each part should have a 'text' property
            rawText = content.parts
              .map(part => {
                if (typeof part === "object" && part.text) {
                  return part.text;
                } else if (typeof part === "string") {
                  return part;
                }
                return "";
              })
              .filter(text => text && text.trim())
              .join('\n');
          } else if (typeof content === "string") {
            rawText = content;
          } else {
            rawText = JSON.stringify(content);
          }
        }
      } else if (rawText.result && typeof rawText.result === "string") {
        rawText = rawText.result;
      } else {
        // Try to stringify the object
        rawText = JSON.stringify(rawText);
      }
    }

    // now cleaning raw text - remove JSON code blocks if present
    let cleanedtext;
    if (typeof rawText === "string") {
      cleanedtext = rawText
        .replace(/^```json\s*/g, "")
        .replace(/```\s*$/g, "")
        .trim();
    } else if (typeof rawText === "object") {
      cleanedtext = JSON.stringify(rawText);
    } else {
      cleanedtext = String(rawText);
    }

    // Parse JSON with better error handling
    let data;
    try {
      data = JSON.parse(cleanedtext);
    } catch (parseErr) {
      // Try to parse as Q&A format (Q1: ... A1: ... Q2: ... A2: ...)
      try {
        data = parseQAFormat(cleanedtext);
      } catch (qaErr) {
        console.error("Q&A Format parse error:", qaErr.message);
        throw new Error(`Failed to parse API response: ${qaErr.message}`);
      }
    }

    // Ensure we always return an array of questions
    let questionsArray = Array.isArray(data) ? data : (data.questions || data.data || []);
    
    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      throw new Error("API response did not contain valid questions array");
    }
    
    // Validate each question has required fields
    questionsArray = questionsArray.map((q, index) => {
      if (!q.question || !q.answer) {
        // Provide defaults if missing
        return {
          question: q.question || q.q || "Question " + (index + 1),
          answer: q.answer || q.a || "Answer not available"
        };
      }
      return q;
    });

    res.status(200).json(questionsArray);
  } catch (err) {
    console.error("Error in generateInterviewQuestions:", err.message);
    
    // Handle API errors
    if (err.response?.status === 429 || err.message.includes("quota")) {
      return res.status(429).json({ 
        message: "API quota exceeded. Please try again later.",
        error: "QUOTA_EXCEEDED"
      });
    }
    
    if (err.response?.status === 401 || err.message.includes("Unauthorized") || err.message.includes("authentication")) {
      return res.status(401).json({ 
        message: "Invalid API key. Please check your Perplexity API credentials.",
        error: "INVALID_API_KEY"
      });
    }
    
    res
      .status(500)
      .json({ message: "failed to generate questions", error: err.message });
  }
};


const generateExplaination = async(req,res)=>{
    try{
        const {question} = req.body;
        if(!question) return res.status(400).json({
            message : "missing required fields"
        })
        const prompt = conceptExplainPrompt(question);
        
        console.log("Sending explanation prompt to Perplexity API...");
        console.log("API Key present:", apiKey ? "Yes" : "No");
        console.log("API Host:", apiHost);
        
        let response;
        try {
          // Add a 15-second timeout (Perplexity is slow)
          response = await Promise.race([
            perplexityClient.post("/", {
              content: prompt,
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('API request timeout after 15 seconds')), 15000)
            )
          ]);
        } catch (apiError) {
          console.error("Perplexity API request failed:", apiError.message);
          console.log("Checking if API credentials are valid...");
          console.log("API Key:", apiKey ? apiKey.substring(0, 10) + "..." : "Missing");
          console.log("API Host:", apiHost);
          
          // Return a helpful message
          return res.status(200).json({
            title: "Explanation",
            explanation: `**About: "${question}"\n\n` +
              `This topic relates to fundamental concepts in web development. ` +
              `To get a detailed explanation, please:\n\n` +
              `1. **Verify your Perplexity API credentials** in .env file\n` +
              `2. Check if API quota is exceeded at https://rapidapi.com/dashboard\n` +
              `3. Or add a GEMINI_API_KEY to your .env for fallback support\n\n` +
              `**Error**: ${apiError.message}`
          });
        }

        console.log("Response received from Perplexity API for explanation");

        if (!response || !response.data) {
          console.log("No response data received, using fallback");
          return res.status(200).json({
            title: "Explanation",
            explanation: `Concept: "${question}"\n\nPlease try the request again.`
          });
        }

        // Check if Perplexity returned an error
        if (response.data.success === false || response.data.error) {
          const errorMsg = response.data.error?.message || "Perplexity API error";
          console.error("Perplexity API Error:", errorMsg);
          return res.status(200).json({
            title: "Explanation",
            explanation: `For the topic: "${question}"\n\nTemporarily unavailable. Please refresh and try again.`
          });
        }
      
        let rawText = response.data;
        
        // Handle different response formats from Perplexity
        if (typeof rawText === "string") {
          console.log("Response is already a string");
        } else if (typeof rawText === "object") {
          if (rawText.content && typeof rawText.content === "string") {
            rawText = rawText.content;
            console.log("Extracted content from response.data.content");
          } else if (rawText.choices) {
            // Handle if choices is an array
            if (Array.isArray(rawText.choices) && rawText.choices[0]) {
              rawText = rawText.choices[0].message?.content || rawText.choices[0].text;
              console.log("Extracted content from response.data.choices[0]");
            } 
            // Handle if choices is an object with content.parts
            else if (typeof rawText.choices === "object" && rawText.choices.content) {
              const content = rawText.choices.content;
              if (content.parts && Array.isArray(content.parts)) {
                rawText = content.parts
                  .map(part => {
                    if (typeof part === "object" && part.text) {
                      return part.text;
                    } else if (typeof part === "string") {
                      return part;
                    }
                    return "";
                  })
                  .filter(text => text && text.trim())
                  .join('\n');
                console.log("Extracted content from response.data.choices.content.parts");
              } else if (typeof content === "string") {
                rawText = content;
                console.log("Extracted content from response.data.choices.content");
              } else {
                rawText = JSON.stringify(content);
                console.log("Stringified choices.content");
              }
            }
          } else if (rawText.result && typeof rawText.result === "string") {
            rawText = rawText.result;
            console.log("Extracted content from response.data.result");
          } else {
            rawText = JSON.stringify(rawText);
            console.log("Stringified entire object");
          }
        }
      
        // now cleaning raw text
        let cleanedtext;
        if (typeof rawText === "string") {
          cleanedtext = rawText
            .replace(/^```json\s*/g, "")
            .replace(/```\s*$/g, "")
            .trim();
        } else if (typeof rawText === "object") {
          cleanedtext = JSON.stringify(rawText);
        } else {
          cleanedtext = String(rawText);
        }
      
        // Parse JSON with better error handling
        let data;
        try {
          data = JSON.parse(cleanedtext);
          console.log("Successfully parsed explanation as JSON");
        } catch (parseErr) {
          console.error("JSON Parse error for explanation:", parseErr.message);
          // For explanation, just return the text as is if JSON parsing fails
          console.log("Returning explanation as plain text");
          data = {
            title: "Explanation",
            explanation: cleanedtext.substring(0, 1000)
          };
        }

        res.status(200).json(data);
        

    } catch (err) {
      console.error("Error in generateExplaination:", err.message);
      
      if (err.response?.status === 429 || err.message.includes("quota")) {
        return res.status(200).json({ 
          title: "Explanation",
          explanation: "API quota exceeded. Please try again later.",
          error: "QUOTA_EXCEEDED"
        });
      }
      
      if (err.response?.status === 401 || err.message.includes("Unauthorized") || err.message.includes("authentication")) {
        return res.status(200).json({ 
          title: "Explanation",
          explanation: "There's an issue with the API credentials. Please contact support.",
          error: "INVALID_API_KEY"
        });
      }
      
      // Return a valid response instead of error to avoid frontend crash
      res.status(200).json({ 
        title: "Explanation",
        explanation: "Unable to generate explanation at this moment. Please try again later."
      });
    }
}

module.exports = { generateInterviewQuestions , generateExplaination};
