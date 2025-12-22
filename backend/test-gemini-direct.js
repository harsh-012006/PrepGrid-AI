const axios = require('axios');

async function test() {
  try {
    console.log('Testing Gemini API call...');
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=AIzaSyCC0JVhbA1dvWTP0RdviwvUV94xKS0Vtzs',
      {
        contents: [
          {
            parts: [
              {
                text: 'Generate 2 short interview questions for a Frontend Developer with 2 years experience. Format: Q1: ... A1: ... Q2: ... A2: ...'
              }
            ]
          }
        ]
      },
      {
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ API Response received!');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Error:');
    console.error('Status:', error.response?.status);
    console.error('Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Message:', error.message);
  }
}

test();
