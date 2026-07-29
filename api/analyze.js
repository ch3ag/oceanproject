module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const image = req.body && req.body.image;
  if (!image) return res.status(400).json({ error: 'Image required' });
  try {
    const api = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: 'gpt-5.4-mini', input: [{ role: 'user', content: [{ type: 'input_text', text: 'Analyze this trash photo for Korean recycling. Return JSON only with item, category, summary, steps (3 strings), warnings (3 strings).' }, { type: 'input_image', image_url: image }] }] }) });
    const data = await api.json();
    const match = (data.output_text || '').match(/\{[\s\S]*\}/);
    if (!api.ok || !match) throw new Error('analysis failed');
    res.status(200).json(JSON.parse(match[0]));
  } catch { res.status(500).json({ error: 'Analysis failed. Please try again.' }); }
};
