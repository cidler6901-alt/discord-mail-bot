import { simpleParser } from "mailparser";
import Imap from "imap";
import { Client, GatewayIntentBits } from "discord.js";

// Discord client setup
const discordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
discordClient.login(process.env.DISCORD_TOKEN);

// Utility to connect to an IMAP account
function createImapClient({ user, password, host, port, tls }) {
  return new Imap({ user, password, host, port, tls });
}

// Watch a single email account
function watchEmail({ user, password, host, port = 993, tls = true, name, discordChannelId }) {
  const imap = createImapClient({ user, password, host, port, tls });

  imap.once("ready", () => {
    imap.openBox("INBOX", false, () => {
      console.log(`[${name}] Watching inbox...`);
      imap.on("mail", () => {
        const fetch = imap.seq.fetch(`${imap.seq.no - 1}:*`, { bodies: "", struct: true });

        fetch.on("message", (msg) => {
          let buffer = "";
          msg.on("body", (stream) => {
            stream.on("data", (chunk) => (buffer += chunk.toString()));
          });
          msg.once("end", async () => {
            const parsed = await simpleParser(buffer);

            // Send to Discord
            const channel = await discordClient.channels.fetch(discordChannelId);
            channel.send(`**[${name}] New email**\nFrom: ${parsed.from.text}\nSubject: ${parsed.subject}`);
          });
        });
      });
    });
  });

  imap.once("error", (err) => console.error(`[${name}] IMAP error:`, err));
  imap.once("end", () => console.log(`[${name}] Connection ended.`));

  imap.connect();
  return imap;
}

// Named export for index.js
export function startEmailWatchers() {
  // Gmail
  watchEmail({
    user: process.env.GMAIL_USER,
    password: process.env.GMAIL_PASS,
    host: "imap.gmail.com",
    name: "Gmail",
    discordChannelId: process.env.DISCORD_CHANNEL_ID,
  });

  // Outlook / Office 365
  watchEmail({
    user: process.env.OUTLOOK_USER,
    password: process.env.OUTLOOK_PASS,
    host: "outlook.office365.com",
    name: "Outlook",
    discordChannelId: process.env.DISCORD_CHANNEL_ID,
  });
}
