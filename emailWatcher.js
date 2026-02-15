const imapConfig = {
  gmail: {
    host: "imap.gmail.com",
    port: 993,
    secure: true
  },
  outlook: {
    host: "imap-mail.outlook.com",
    port: 993,
    secure: true
  }
};

for (const account of config.emails) {
  const imap = new ImapFlow({
    host: imapConfig[account.service].host,
    port: imapConfig[account.service].port,
    secure: imapConfig[account.service].secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });

  try {
    await imap.connect();
    console.log(`📡 Connected to ${account.service} (${account.user})`);
  } catch (err) {
    console.error(`❌ Failed to connect to ${account.service}:`, err.message);
  }
}
