import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import sgMail from "@sendgrid/mail";
import juice from "juice";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const DEFAULT_FROM_EMAIL = "jaysoni998.js@gmail.com";
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || DEFAULT_FROM_EMAIL;
const FROM_NAME = process.env.SENDGRID_FROM_NAME || "Email Studio";
const HAS_CONFIGURED_FROM_EMAIL = Boolean(process.env.SENDGRID_FROM_EMAIL?.trim());

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) || true,
  })
);
app.use(express.json({ limit: "2mb" }));

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
  })
);

app.use((error, _req, res, next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "The request body contains invalid JSON.",
    });
  }

  return next(error);
});

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const buildPlainText = (html) =>
  String(html || "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|tr|table|section|article|br)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

const buildEmailHtml = (html, shouldWrap) => {
  const content = typeof html === "string" ? html.trim() : "";

  if (!content) {
    return "";
  }

  if (!shouldWrap || /<html[\s>]/i.test(content) || /<!doctype/i.test(content)) {
    return juice(content);
  }

  return juice(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Studio</title>
      </head>
      <body style="margin:0;padding:24px;background:#edf2ff;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#edf2ff;">
          <tr>
            <td align="center">
              <table width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border-radius:24px;overflow:hidden;">
                <tr>
                  <td style="padding:32px 28px;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `);
};

app.get("/", (_req, res) => {
  res.send("Email API running");
});

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    provider: "sendgrid",
    configured: Boolean(SENDGRID_API_KEY && HAS_CONFIGURED_FROM_EMAIL),
    fromEmail: FROM_EMAIL,
    fromName: FROM_NAME,
  });
});

app.post("/send-test-emails", async (req, res) => {
  try {
    if (!SENDGRID_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Missing SENDGRID_API_KEY on the server.",
      });
    }

    if (!HAS_CONFIGURED_FROM_EMAIL) {
      return res.status(500).json({
        success: false,
        message: "Missing SENDGRID_FROM_EMAIL on the server.",
      });
    }

    const { recipients, subject, html, wrap = true } = req.body ?? {};

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Add at least one recipient email.",
      });
    }

    const normalizedRecipients = [...new Set(recipients.map((email) => String(email).trim().toLowerCase()))];
    const invalidRecipients = normalizedRecipients.filter((email) => !isValidEmail(email));

    if (invalidRecipients.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more email addresses are invalid.",
        invalidRecipients,
      });
    }

    if (!subject || !String(subject).trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject is required.",
      });
    }

    const emailHtml = buildEmailHtml(html, wrap);
    const emailText = buildPlainText(emailHtml);

    if (!emailHtml) {
      return res.status(400).json({
        success: false,
        message: "HTML content is required.",
      });
    }

    const sendResults = await Promise.allSettled(
      normalizedRecipients.map(async (recipient) => {
        const [response] = await sgMail.send({
          to: recipient,
          from: {
            email: FROM_EMAIL,
            name: FROM_NAME,
          },
          subject: String(subject).trim(),
          html: emailHtml,
          text: emailText,
        });

        const accepted = response.statusCode >= 200 && response.statusCode < 300;
        const messageId =
          response.headers?.["x-message-id"] ||
          response.headers?.["X-Message-Id"] ||
          response.headers?.["x-message-id".toLowerCase()] ||
          null;

        if (!accepted) {
          throw new Error(`SendGrid returned unexpected status ${response.statusCode}.`);
        }

        return {
          email: recipient,
          statusCode: response.statusCode,
          messageId,
        };
      })
    );

    const results = sendResults.map((result, index) => {
      if (result.status === "fulfilled") {
        return {
          email: normalizedRecipients[index],
          success: true,
          statusCode: result.value.statusCode,
          messageId: result.value.messageId,
        };
      }

      return {
        email: normalizedRecipients[index],
        success: false,
        message:
          result.reason?.response?.body?.errors?.[0]?.message ||
          result.reason?.message ||
          "Failed to send email",
      };
    });

    const sentCount = results.filter((item) => item.success).length;

    return res.status(sentCount === results.length ? 200 : 207).json({
      success: sentCount > 0,
      message:
        sentCount === results.length
          ? "Test emails sent successfully."
          : "Some test emails could not be sent.",
      sentCount,
      failedCount: results.length - sentCount,
      results,
    });
  } catch (error) {
    console.error("SENDGRID ERROR:", error.response?.body || error);

    return res.status(500).json({
      success: false,
      message: "Failed to send test emails.",
      error: error.message,
    });
  }
});

app.use((_req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

app.use((error, _req, res, _next) => {
  console.error("UNHANDLED SERVER ERROR:", error);

  return res.status(500).json({
    success: false,
    message: "Unexpected server error.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
