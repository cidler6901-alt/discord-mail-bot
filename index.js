import { Client, GatewayIntentBits } from "discord.js";
import { startEmailWatchers } from "./emailWatcher.js";
import config from "./config.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  await startEmailWatchers(client, config);
});

client.login(config.discord.token);
