import express from "express";
import { Client, GatewayIntentBits } from "discord.js";
import { startEmailWatchers } from "./emailWatcher.js";
import config from "./config.js";

// --------------------
// Web server (required by Render)
// --------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("📧 Discord Mail Bot is running ✅");
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// --------------------
// Discord bot setup
// --------------------
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Make sure token exists
if (!config.discord.token) {
  console.error("❌ BOT_TOKEN is missing! Set it in Render Environment variables.");
  process.exit(1);
}

// Login and start watchers
client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  try {
    await startEmailWatchers(client, config);
    console.log("📡 Email watchers started for Gmail & Zoho.");
  } catch (err) {
    console.error("❌ Failed to start email watchers:", err);
  }
});
console.log("BOT_TOKEN exists:", !!process.env.BOT_TOKEN);
console.log("config.discord.token exists:", !!config.discord.token);

client.login(config.discord.token).catch((err) => {
  console.error("❌ Discord login failed. Check BOT_TOKEN:", err);
  process.exit(1);
});
