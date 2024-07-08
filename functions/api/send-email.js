export async function onRequestPost(context) {
  try {
      const { from, to, subject, text } = await context.request.json();

      if (!RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not set');
      }
      console.log("env is ",RESEND_API_KEY);
      token=RESEND_API_KEY;
      token = 'Bearer '+token;
      console.log("token is ",token);
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': token,
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
