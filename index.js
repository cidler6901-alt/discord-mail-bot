import express from "express";
import { Client, GatewayIntentBits } from "discord.js";
import { startEmailWatchers } from "./emailWatcher.js";
import config from "./config.js";

const app = express();
const PORT = process.env.PORT || 3000;

// --- Web server for Render ---
app.get("/", (req, res) => {
  res.send("Discord Mail Bot is running ✅");
});

app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});

// --- Discord bot ---
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  await startEmailWatchers(client, config);
});

// Debug token loading
if (!config.discord.token) {
  console.error("❌ BOT_TOKEN is missing from environment variables!");
  process.exit(1);
}

client.login(config.discord.token);
