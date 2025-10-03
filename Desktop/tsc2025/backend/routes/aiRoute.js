
import express from 'express';
import { OpenAI } from 'openai';

const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/enrich-songs", async (req, res) => {
  try {
    const { rawTitles = [] } = req.body;

    if (!Array.isArray(rawTitles) || rawTitles.length === 0) {
      return res.status(400).json({ error: "No song titles provided" });
    }

    const prompt = `You are a music metadata expert. Given a list of song titles, return accurate metadata for each song in this JSON format:
[
  {
    "title": "Title",
    "artist": "Artist",
    "year": 2000,
    "genre": "Genre"
  },
  ...
]

Only return valid entries. Here's the list:
${rawTitles.join("\n")}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const text = completion.choices[0].message.content;
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    const songs = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return res.json({ songs });
  } catch (err) {
    console.error("❌ enrich-songs failed:", err);
    return res.status(500).json({ error: "Failed to enrich songs" });
  }
});

router.post('/lookup-song', async (req, res) => {
  const { title, artist, genre } = req.body;

  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const prompt = `You are a music metadata expert. Given the song info below, return the most accurate metadata in JSON format with fields: title, artist, year, and genre.
    
Song info:
Title: ${title}
${artist ? `Artist: ${artist}` : ''}
${genre ? `Genre: ${genre}` : ''}

Return JSON like: { "title": "", "artist": "", "year": 2000, "genre": "" }`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    const match = completion.choices[0].message.content.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ message: 'Failed to parse AI response' });

    const song = JSON.parse(match[0]);
    return res.json({ song });
  } catch (error) {
    console.error('AI lookup error:', error);
    res.status(500).json({ message: 'AI lookup failed' });
  }
});

export default router;