const axios = require('axios');

async function test() {
  try {
    console.log('Testing Gemini API directly...');
    console.log('Using API key:', process.env.GEMINI_API_KEY?.substring(0, 10) + '...');
    
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        contents: [
          {
            parts: [
              {
                text: 'Generate 1 short interview question for a Frontend Developer with 2 years experience in React.'
              }
            ]
          }
        ]
      },
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(response.data, null, 2).substring(0, 500));
  } catch (error) {
    console.error('❌ Error:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.message);
    if (error.response?.data) {
      console.error('API Error:', JSON.stringify(error.response.data, null, 2).substring(0, 500));
    }
  }
}

require('dotenv').config();
test();
