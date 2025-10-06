// get-google-token.js
import express from "express";

import { google } from "googleapis";

const CLIENT_ID="775253173644-b68082lk5oh5k78b3omrhbfa27o0t2hq.apps.googleusercontent.com"
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:54321/oauth2callback"; // or http://localhost:4000/... for local

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.events.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

const oauth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const app = express();

app.get("/oauth2callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2.getToken(code);
    console.log("\n✅ Refresh token:\n", tokens.refresh_token);
    res.send(`<pre>Success! Refresh token:\n${tokens.refresh_token || "(none)"}\nYou can close this window.</pre>`);
  } catch (e) {
    console.error("Token exchange failed:", e?.response?.data || e?.message || e);
    res.status(500).send("Token exchange failed. Check terminal logs.");
  } finally {
    setTimeout(() => process.exit(0), 1500);
  }
});

app.listen(54321, () => {
  const url = oauth2.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });
  console.log("\n🔗 Open this URL in your browser:\n", url, "\n");
});