export async function onRequestPost(context) {
  try {
      const { from, to, subject, text } = await context.request.json();

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer re_27NGf74F_5BQnPT6uHiEkczakKx7KNYic',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: from,
            to: [to],
            subject: subject,
            text: text
        })
    });
      
      const result = await response.json();
      
      if (response.ok) {
          return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
              headers: { 'Content-Type': 'application/json' }
          });
      } else {
          return new Response(JSON.stringify({ message: result.message || 'Failed to send email' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' }
          });
      }
  } catch (error) {
      console.log("post error",error);
      return new Response(JSON.stringify({ message: error }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
      });
  }
}
