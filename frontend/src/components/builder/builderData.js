export const templates = [
  {
    id: "launch",
    name: "Launch Note",
    description: "A polished announcement for product releases.",
    subject: "Your latest release is live",
    html: `
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#54617d;">Email Studio release</p>
      <h1 style="margin:0 0 16px;font-size:34px;line-height:1.12;color:#182133;">A release email that feels confident and clear</h1>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.8;color:#556070;">
        Use this space to tell customers what changed, why it matters, and where they should go next.
      </p>
      <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
        <tr>
          <td style="border-radius:999px;background:#1f2937;">
            <a href="https://example.com" style="display:inline-block;padding:14px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Explore the update</a>
          </td>
        </tr>
      </table>
      <div style="padding:24px;border-radius:24px;background:#f3efe7;">
        <p style="margin:0;font-size:14px;line-height:1.8;color:#5c6474;">
          Add supporting bullets, testimonials, or visual highlights without overwhelming the inbox.
        </p>
      </div>
    `,
  },
  {
    id: "digest",
    name: "Digest",
    description: "A tidy weekly or monthly roundup.",
    subject: "A refined roundup for your readers",
    html: `
      <h1 style="margin:0 0 18px;font-size:32px;line-height:1.15;color:#192133;">Everything your audience needs this week</h1>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.75;color:#556070;">
        Keep the lead focused and let the rest of the message fall into clean, scannable sections.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">
        <tr>
          <td style="padding:20px;border:1px solid #e7e1d7;border-radius:20px;">
            <h2 style="margin:0 0 8px;font-size:18px;color:#192133;">Feature story</h2>
            <p style="margin:0;font-size:14px;line-height:1.75;color:#657083;">Lead with one strong update and keep the CTA single-minded.</p>
          </td>
        </tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:20px;border:1px solid #e7e1d7;border-radius:20px;">
            <h2 style="margin:0 0 8px;font-size:18px;color:#192133;">Secondary note</h2>
            <p style="margin:0;font-size:14px;line-height:1.75;color:#657083;">Use this block for support resources, events, or product updates.</p>
          </td>
        </tr>
      </table>
    `,
  },
  {
    id: "plain",
    name: "Founder Letter",
    description: "A more personal, text-led format.",
    subject: "A concise update from the team",
    html: `
      <h1 style="margin:0 0 18px;font-size:28px;line-height:1.2;color:#192133;">A note that feels direct and human</h1>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.85;color:#384152;">Hello,</p>
      <p style="margin:0 0 16px;font-size:16px;line-height:1.85;color:#384152;">
        This layout is designed for updates where the writing matters most and the presentation should stay understated.
      </p>
      <p style="margin:0;font-size:16px;line-height:1.85;color:#384152;">
        Replace this with your own message, preview it, and send it to a small QA list before publishing widely.
      </p>
    `,
  },
  {
    id: "welcome",
    name: "Welcome Email",
    description: "Great for new users after signup.",
    subject: "Welcome - here is what to do first",
    html: `
      <h1 style="margin:0 0 14px;font-size:32px;line-height:1.15;color:#192133;">Welcome to Email Studio</h1>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#4b5568;">
        Thanks for joining us. This quick email helps new users get value in the first few minutes.
      </p>
      <ol style="margin:0 0 22px;padding-left:20px;color:#4b5568;font-size:15px;line-height:1.8;">
        <li>Set up your first campaign.</li>
        <li>Preview it on desktop and mobile.</li>
        <li>Send a test to your team.</li>
      </ol>
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-radius:999px;background:#1f2937;">
            <a href="https://example.com" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Start now</a>
          </td>
        </tr>
      </table>
    `,
  },
  {
    id: "promo",
    name: "Limited-Time Offer",
    description: "For sales, discounts, and urgency campaigns.",
    subject: "48-hour offer: save 25% today",
    html: `
      <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#7c3aed;">Limited time</p>
      <h1 style="margin:0 0 16px;font-size:34px;line-height:1.12;color:#1f2937;">Your exclusive offer ends soon</h1>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.8;color:#4b5568;">
        Keep this short: what the offer is, who it is for, and exactly when it expires.
      </p>
      <div style="margin:0 0 22px;padding:16px 18px;border-radius:16px;background:#faf5ff;border:1px solid #e9d5ff;">
        <p style="margin:0;font-size:14px;line-height:1.7;color:#6d28d9;">Use code <strong>SAVE25</strong> before Friday, 11:59 PM.</p>
      </div>
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-radius:999px;background:#7c3aed;">
            <a href="https://example.com" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Claim offer</a>
          </td>
        </tr>
      </table>
    `,
  },
  {
    id: "event",
    name: "Event Reminder",
    description: "Useful for webinars, launches, and live sessions.",
    subject: "Reminder: your event starts tomorrow",
    html: `
      <h1 style="margin:0 0 14px;font-size:32px;line-height:1.15;color:#192133;">Your event is coming up</h1>
      <p style="margin:0 0 18px;font-size:16px;line-height:1.8;color:#4b5568;">
        Send this one day or one hour before the event to increase attendance.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
        <tr>
          <td style="padding:18px;border:1px solid #e5e7eb;border-radius:14px;background:#f8fafc;">
            <p style="margin:0 0 6px;font-size:13px;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;">Event details</p>
            <p style="margin:0;font-size:15px;line-height:1.7;color:#334155;">Thursday, 6:00 PM IST<br/>Live product walkthrough and Q&A</p>
          </td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-radius:999px;background:#0f172a;">
            <a href="https://example.com" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Join event</a>
          </td>
        </tr>
      </table>
    `,
  },
  {
    id: "cart",
    name: "Abandoned Cart",
    description: "Recover carts with a clear return CTA.",
    subject: "You left something behind",
    html: `
      <h1 style="margin:0 0 12px;font-size:31px;line-height:1.16;color:#192133;">Still thinking it over?</h1>
      <p style="margin:0 0 22px;font-size:16px;line-height:1.8;color:#4b5568;">
        Your selected items are still in your cart. Complete checkout before stock runs out.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">
        <tr>
          <td style="padding:14px 16px;border:1px solid #e5e7eb;border-radius:12px;">
            <p style="margin:0 0 4px;font-size:14px;color:#1f2937;">Premium Linen Shirt</p>
            <p style="margin:0;font-size:13px;color:#6b7280;">Size M · Sand · Qty 1</p>
          </td>
        </tr>
      </table>
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-radius:999px;background:#1f2937;">
            <a href="https://example.com" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Return to cart</a>
          </td>
        </tr>
      </table>
    `,
  },
  {
    id: "feedback",
    name: "Feedback Request",
    description: "Collect quick feedback after delivery or onboarding.",
    subject: "How was your experience?",
    html: `
      <h1 style="margin:0 0 12px;font-size:30px;line-height:1.18;color:#1f2937;">We would love your feedback</h1>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#4b5568;">
        Your response helps us improve the product for everyone.
      </p>
      <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#6b7280;">This takes less than 60 seconds.</p>
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-radius:999px;background:#0f172a;">
            <a href="https://example.com" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Share feedback</a>
          </td>
        </tr>
      </table>
    `,
  },
  {
    id: "reactivation",
    name: "Win-Back Campaign",
    description: "Bring inactive users back with one clear message.",
    subject: "A quick update since your last visit",
    html: `
      <h1 style="margin:0 0 12px;font-size:31px;line-height:1.16;color:#192133;">We saved something for you</h1>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.8;color:#4b5568;">
        It has been a while - here is what is new and why now is a good time to come back.
      </p>
      <ul style="margin:0 0 22px;padding-left:20px;font-size:15px;line-height:1.8;color:#4b5568;">
        <li>New templates for faster campaigns</li>
        <li>Cleaner preview and testing flow</li>
        <li>Improved delivery reliability</li>
      </ul>
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-radius:999px;background:#1d4ed8;">
            <a href="https://example.com" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">Come back in</a>
          </td>
        </tr>
      </table>
    `,
  },
];

export const defaultState = {
  subject: "A refined campaign preview",
  html: templates[0].html.trim(),
  recipients: ["hello@example.com"],
  wrap: true,
};

export const statusStyles = {
  success: "bg-emerald-50 text-emerald-800",
  error: "bg-rose-50 text-rose-800",
  warning: "bg-amber-50 text-amber-800",
  pending: "bg-slate-100 text-slate-700",
  idle: "bg-slate-50 text-slate-600",
};

export const extractEmails = (input) =>
  input
    .split(/[\n,;\s]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const formatHtml = (html) => {
  if (!html.trim()) {
    return html;
  }

  return html.replace(/>\s+</g, ">\n<").replace(/\n{3,}/g, "\n\n").trim();
};

export const parseJsonResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: "The server returned an unreadable response." };
  }
};
