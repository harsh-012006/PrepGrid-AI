const axios = require('axios');

axios.post('http://localhost:5000/api/ai/generate-questions', {
  role: 'Full Stack Developer',
  experience: '2',
  topicsToFocus: 'React, Node.js',
  numberOfQuestions: 5
}).then(r => {
  console.log('Success! Questions:', r.data.length);
  r.data.forEach((q, i) => console.log(`${i+1}. ${q.question}`));
}).catch(e => {
  console.error('Full error:', e.toString());
  console.error('Message:', e.message);
  console.error('Status:', e.response?.status);
  console.error('Data:', e.response?.data);
});
