const EmailSender = () => {
  const [from, setFrom] = React.useState('');
  const [to, setTo] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [text, setText] = React.useState('');
  const [status, setStatus] = React.useState('');

  const sendEmail = async (e) => {
    e.preventDefault();
    setStatus('发送中...');
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, subject, text }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatus(data.message || '邮件发送成功');
    } catch (error) {
      console.error('Error details:', error);
      setStatus(`发送出错：${error.message}. 请查看控制台以获取更多信息。`);
    }
  };

  // ... 其余的组件代码保持不变 ...
};

ReactDOM.render(<EmailSender />, document.getElementById('root'));