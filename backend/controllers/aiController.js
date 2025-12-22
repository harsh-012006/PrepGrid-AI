const axios = require("axios");
const {
  questionAnswerPrompt,
  conceptExplainPrompt,
  generateFallbackExplanation,
  generateFallbackQuestions,
} = require("../utils/prompt");

const apiKey = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";

// Helper function to parse Q&A format
const parseQAFormat = (text) => {
  const questions = [];
  const lines = text.split('\n');
  let currentQ = null;
  let currentA = null;
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    let qMatch = trimmed.match(/^Q\d+:\s*(.*)/i);
    if (!qMatch) {
      qMatch = trimmed.match(/^[\d]+[\.\)]\s+(.+)/);
    }
    
    if (qMatch) {
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
    
    let aMatch = trimmed.match(/^A\d+:\s*(.*)/i);
    
    if (!aMatch && currentQ && !currentA) {
      currentA = trimmed;
      continue;
    }
    
    if (aMatch) {
      currentA = (currentA || '') + (currentA ? ' ' : '') + aMatch[1];
      continue;
    }
    
    if (currentQ && !currentA && !trimmed.match(/^[\d]+[\.\)]|^Q\d+:|^A\d+:/i)) {
      currentQ = currentQ + ' ' + trimmed;
    } 
    else if (currentA && !trimmed.match(/^[\d]+[\.\)]|^Q\d+:|^A\d+:/i)) {
      currentA = currentA + ' ' + trimmed;
    }
  }
  
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

// Generate Interview Questions with pagination support
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Try Gemini API first
    try {
      const prompt = questionAnswerPrompt(
        numberOfQuestions,
        role,
        experience,
        topicsToFocus
      );

      console.log("Calling Gemini API for interview questions...");

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${apiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        },
        {
          timeout: 60000,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.data) {
        throw new Error("No response from Gemini API");
      }

      let rawText = "";
      
      // Extract text from Gemini response
      if (response.data.candidates && response.data.candidates[0]) {
        const candidate = response.data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          rawText = candidate.content.parts[0].text;
        }
      }

      if (!rawText) {
        throw new Error("No text content in Gemini response");
      }

      console.log("Response received from Gemini API");

      let cleanedtext = rawText
        .replace(/^```json\s*/g, "")
        .replace(/```\s*$/g, "")
        .trim();

      let data;
      try {
        data = JSON.parse(cleanedtext);
      } catch (parseErr) {
        try {
          data = parseQAFormat(cleanedtext);
        } catch (qaErr) {
          console.error("Q&A Format parse error:", qaErr.message);
          throw new Error(`Failed to parse API response: ${qaErr.message}`);
        }
      }

      let questionsArray = Array.isArray(data) ? data : (data.questions || data.data || []);
      
      if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
        throw new Error("API response did not contain valid questions array");
      }
      
      questionsArray = questionsArray.map((q, index) => {
        if (!q.question || !q.answer) {
          return {
            question: q.question || q.q || "Question " + (index + 1),
            answer: q.answer || q.a || "Answer not available"
          };
        }
        return q;
      });

      return res.status(200).json(questionsArray);

    } catch (apiError) {
      console.log("Gemini API failed, using fallback questions");
      throw apiError;
    }

  } catch (err) {
    console.error("Error in generateInterviewQuestions:", err.message);
    
    // Use fallback questions
    const { numberOfQuestions, role, topicsToFocus } = req.body;
    const fallbackQuestions = generateFallbackQuestions(numberOfQuestions, role, topicsToFocus);
    return res.status(200).json(fallbackQuestions);
  }
};

// Generate Explanation
const generateExplaination = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const prompt = conceptExplainPrompt(question);
    
    console.log("Calling Gemini API for explanation...");

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        timeout: 60000,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.data) {
      console.log("No response data received, using fallback");
      const fallback = generateFallbackExplanation(question);
      return res.status(200).json(fallback);
    }

    let rawText = "";
    
    // Extract text from Gemini response
    if (response.data.candidates && response.data.candidates[0]) {
      const candidate = response.data.candidates[0];
      if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
        rawText = candidate.content.parts[0].text;
      }
    }

    if (!rawText) {
      console.log("No text content in response, using fallback");
      const fallback = generateFallbackExplanation(question);
      return res.status(200).json(fallback);
    }

    console.log("Response received from Gemini API for explanation");

    let cleanedtext = rawText
      .replace(/^```json\s*/g, "")
      .replace(/```\s*$/g, "")
      .trim();

    let data;
    try {
      data = JSON.parse(cleanedtext);
      console.log("Successfully parsed explanation as JSON");
    } catch (parseErr) {
      console.error("JSON Parse error for explanation:", parseErr.message);
      data = {
        title: "Explanation",
        explanation: cleanedtext.substring(0, 2000)
      };
    }

    res.status(200).json(data);
        
  } catch (err) {
    console.error("Error in generateExplaination:", err.message);
    
    // Use fallback explanation
    const fallback = generateFallbackExplanation(req.body.question);
    res.status(200).json(fallback);
  }
};

module.exports = { generateInterviewQuestions, generateExplaination };
