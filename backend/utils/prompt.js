const conceptExplainPrompt = (question) => `
You are an AI trained to generate explanations for a given interview question.

Task:

- Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
- Question: "${question}"
- After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
- If the explanation includes a code example, provide a small code block.
- Keep the formatting very clean and clear.
- Return the result as a valid JSON object in the following format:

{
  "title": "Short title here?",
  "explanation": "Explanation here."
}

Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`;


const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => (`
Generate exactly ${numberOfQuestions} technical interview questions and detailed answers for:
- Job Role: ${role}
- Experience Level: ${experience} years  
- Focus Topics: ${topicsToFocus}

IMPORTANT: Format the output EXACTLY as shown below:

Q1: [First question here?]
A1: [Detailed answer here covering the concept, examples, and best practices]

Q2: [Second question here?]
A2: [Detailed answer here covering the concept, examples, and best practices]

Q3: [Third question here?]
A3: [Detailed answer here covering the concept, examples, and best practices]

Continue this pattern for all ${numberOfQuestions} questions.

Requirements:
- Each answer should be detailed and beginner-friendly
- Include code examples where relevant
- Each answer should be 3-5 sentences minimum
- Format must follow Q#: and A#: pattern exactly
- Do NOT add any introductory text before Q1
- Do NOT add any closing text after A${numberOfQuestions}
`)

    
module.exports = {questionAnswerPrompt, conceptExplainPrompt};