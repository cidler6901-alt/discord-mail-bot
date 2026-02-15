export default {
  discord: {
    token: process.env.BOT_TOKEN
  },
  emails: [
    {
      service: "gmail",
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    },
    {
      service: "outlook",
      user: process.env.OUTLOOK_USER,
      pass: process.env.OUTLOOK_PASS
    }
  ]
};
