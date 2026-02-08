export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ reply: 'Método no permitido' });

  try {
    // Manejo de body robusto para evitar errores de API
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
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ reply: "Error de Groq: " + (data.error?.message || "Respuesta vacía") });
    }
  } catch (error) {
    res.status(500).json({ reply: "Error en el servidor: " + error.message });
  }
}