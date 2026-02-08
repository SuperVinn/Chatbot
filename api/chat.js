export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ reply: 'Denegado' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { prompt } = body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: "Eres un Asistente Virtual experto en Logística y Operaciones para Cargill. Tu tono es profesional, eficiente y servicial. Ayudas a los empleados con dudas sobre optimización de rutas, gestión de suministros y protocolos de seguridad alimentaria. Responde de forma concisa en español." 
          },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ reply: "Error de servidor." });
  }
}