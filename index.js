document.getElementById('emailForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const subject = document.getElementById('subject').value;
  const text = document.getElementById('message').value;
  
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = 'Sending email...';
  
  try {
      const response = await axios.post('/api/send-email', { from, to, subject, text });
      resultDiv.textContent = 'Email sent successfully!';
  } catch (error) {
      resultDiv.textContent = `Error: ${error.response?.data?.message || error.message}`;
  }
});