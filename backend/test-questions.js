const axios = require('axios');

async function test() {
  try {
    console.log('Test 1: React and Node.js topics');
    const response1 = await axios.post('http://localhost:5000/api/ai/generate-questions', {
      role: 'Full Stack Developer',
      experience: '2',
      topicsToFocus: 'React, Node.js',
      numberOfQuestions: 5
    });
    
    console.log('Questions returned:', response1.data.length);
    response1.data.forEach((q, i) => {
      console.log(`${i+1}. ${q.question.substring(0, 60)}...`);
    });
    
    console.log('\n\nTest 2: Second request (should have different questions due to shuffle)');
    const response2 = await axios.post('http://localhost:5000/api/ai/generate-questions', {
      role: 'Full Stack Developer',
      experience: '2',
      topicsToFocus: 'React, Node.js',
      numberOfQuestions: 5
    });
    
    console.log('Questions returned:', response2.data.length);
    response2.data.forEach((q, i) => {
      console.log(`${i+1}. ${q.question.substring(0, 60)}...`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

test();
