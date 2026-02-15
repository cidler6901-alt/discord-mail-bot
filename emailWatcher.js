import { simpleParser } from "mailparser";
import Imap from "imap";

// Utility to connect to any IMAP account
function createImapClient({ user, password, host, port, tls }) {
  return new Imap({ user, password, host, port, tls });
}

// Function to watch a single email account
function watchEmail({ user, password, host, port = 993, tls = true, name }, onMail) {
  const imap = createImapClient({ user, password, host, port, tls });

  imap.once("ready", () => {
    imap.openBox("INBOX", false, () => {
      console.log(`[${name}] Watching inbox...`);
      imap.on("mail", () => {
        const fetch = imap.seq.fetch(`${imap.seq.no - 1}:*`, {
          bodies: "",
          struct: true,
        });

        fetch.on("message", (msg) => {
          let buffer = "";
          msg.on("body", (stream) => {
            stream.on("data", (chunk) => (buffer += chunk.toString()));
          });
          msg.once("end", async () => {
            const parsed = await simpleParser(buffer);
            onMail(name, parsed);
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
  watchEmail(
    {
      user: process.env.GMAIL_USER,
      password: process.env.GMAIL_PASS,
      host: "imap.gmail.com",
      name: "Gmail",
    },
    (account, mail) => {
      console.log(`[${account}] New email from ${mail.from.text}: ${mail.subject}`);
    }
  );

  // Zoho
  watchEmail(
    {
      user: process.env.ZOHO_USER,
      password: process.env.ZOHO_PASS,
      host: "imap.zoho.com",
      name: "Zoho",
    },
    (account, mail) => {
      console.log(`[${account}] New email from ${mail.from.text}: ${mail.subject}`);
    }
  );

  // Outlook / Office 365
  watchEmail(
    {
      user: process.env.OUTLOOK_USER,
      password: process.env.OUTLOOK_PASS,
      host: "outlook.office365.com",
      name: "Outlook",
    },
    (account, mail) => {
      console.log(`[${account}] New email from ${mail.from.text}: ${mail.subject}`);
    }
  );
}
