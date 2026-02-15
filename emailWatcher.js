import { ImapFlow } from "imapflow";

export async function startEmailWatchers(client, config) {
  watchAccount(client, config.gmail, "GMAIL", config.discord.channelId, config.filters);
  watchAccount(client, config.zoho, "ZOHO", config.discord.channelId, config.filters);
}

async function watchAccount(client, mailConfig, label, channelId, filters) {
  const imap = new ImapFlow({
    host: mailConfig.host,
    port: mailConfig.port,
    secure: mailConfig.secure,
    auth: {
      user: mailConfig.user,
      pass: mailConfig.pass
    }
  });

  await imap.connect();
  await imap.mailboxOpen("INBOX");

  console.log(`📡 Watching ${label} inbox...`);

  imap.on("exists", async () => {
    try {
      const message = await imap.fetchOne(imap.mailbox.exists, {
        envelope: true,
        source: false
      });

      if (!message?.envelope) return;

      const from = message.envelope.from?.[0]?.address || "Unknown";
      const subject = message.envelope.subject || "(No Subject)";

      // Filters
      if (filters.ignoreSenders.includes(from)) return;
      if (filters.ignoreSubjects.includes(subject)) return;

      if (filters.keywords.length > 0) {
        const hit = filters.keywords.some(k =>
          subject.toLowerCase().includes(k.toLowerCase())
        );
        if (!hit) return;
      }

      const channel = await client.channels.fetch(channelId);

      await channel.send({
        embeds: [{
          title: `📧 New ${label} Email`,
          color: 0x00ffcc,
          fields: [
            { name: "From", value: from, inline: false },
            { name: "Subject", value: subject, inline: false }
          ],
          timestamp: new Date()
        }]
      });

    } catch (err) {
      console.error(`❌ ${label} error:`, err.message);
    }
  });
}
