const axios = require('axios');

const API_BASE = 'http://localhost:5000/api/ai';

// Test data
const testData = {
  role: 'Frontend Developer',
  experience: '2',
  topicsToFocus: 'React, JavaScript, CSS',
  numberOfQuestions: 3
};

// Test generate questions
async function testQuestions() {
  try {
    console.log('Testing Generate Questions Endpoint...');
    console.log('Request body:', testData);
    
    const response = await axios.post(`${API_BASE}/generate-questions`, testData);
    
    console.log('\n✅ Questions generated successfully!');
    console.log('Number of questions:', response.data.length);
    console.log('First question:', response.data[0]);
    
    return response.data[0]?.question;
  } catch (error) {
    console.error('❌ Error generating questions:');
    console.error('Full Error:', error);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    return null;
  }
}

// Test generate explanation
async function testExplanation(question) {
  if (!question) {
    console.log('\nSkipping explanation test - no question available');
    return;
  }
  
  try {
    console.log('\n\nTesting Generate Explanation Endpoint...');
    console.log('Question:', question);
    
    const response = await axios.post(`${API_BASE}/generate-explanation`, { question });
    
    console.log('\n✅ Explanation generated successfully!');
    console.log('Title:', response.data.title);
    console.log('Explanation preview:', response.data.explanation?.substring(0, 100) + '...');
  } catch (error) {
    console.error('❌ Error generating explanation:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('========================================');
  console.log('Testing Gemini API Integration');
  console.log('========================================\n');
  
  const question = await testQuestions();
  await testExplanation(question);
  
  console.log('\n========================================');
  console.log('Tests Complete!');
  console.log('========================================');
}

runTests();
