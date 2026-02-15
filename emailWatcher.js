// emailWatcher.js
const { EmailWatcher } = require("some-email-watcher-lib"); // replace with your actual lib

// Only include the services you actually use
const watcher = new EmailWatcher({
  services: ["gmail"],   // remove "zoho" from here
  credentials: {
    gmail: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
    // no Zoho credentials at all
  },
  pollingInterval: 30000, // 30s polling
});

watcher.on("newEmail", (email) => {
  console.log("📧 New Gmail message:", email.subject);
});

// Start only the explicitly configured watchers
watcher.start()
  .then(() => console.log("📡 Email watchers started for Gmail only."))
  .catch(console.error);
