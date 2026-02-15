
import "dotenv/config";

export default {
  discord: {
    token: process.env.BOT_TOKEN,
    channelId: "1472388183529492583"
  },

  gmail: {
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    user: "carsonidler6901@gmail.com",
    pass: process.env.GMAIL_PASS
  },

  zoho: {
    host: "imap.zoho.com",
    port: 993,
    secure: true,
    user: "cidler6901@zohomail.com",
    pass: process.env.ZOHO_PASS
  },

  filters: {
    ignoreSubjects: [],
    ignoreSenders: [],
    keywords: []
  }
};
