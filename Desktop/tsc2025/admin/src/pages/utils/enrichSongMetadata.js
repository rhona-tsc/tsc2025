import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const enrichSongMetadata = async (rawSongs = []) => {
  const prompts = rawSongs.map(s => `Find details for: "${s}"`).join("\n");

  const { choices } = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: `
For each of these song titles, return an array of objects with title, artist, genre, and release year (as number). Format like this: [{"title": "...", "artist": "...", "genre": "...", "year": 1983}]
${prompts}
    `}],
    temperature: 0.3,
  });

  const parsed = JSON.parse(choices[0].message.content);
  return parsed;
};