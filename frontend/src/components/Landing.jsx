import { useEffect, useState } from "react";

const previewSlides = [
  {
    label: "Product update",
    note: "Announce new features in one clean layout.",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:28px;background:#f4f0e8;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center">
                <table width="620" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;background:#ffffff;border:1px solid #ebe6db;border-radius:28px;overflow:hidden;">
                  <tr>
                    <td style="padding:34px 34px 28px;background:#182339;">
                      <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#b9c6ea;">Email Studio</p>
                      <h1 style="margin:0;font-size:34px;line-height:1.08;color:#ffffff;">Elegant email review for teams shipping real campaigns</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px 34px;">
                      <p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:#516070;">
                        Write HTML, preview it instantly, and send carefully controlled test deliveries before launch.
                      </p>
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="border-radius:999px;background:#182339;">
                            <a href="https://example.com" style="display:inline-block;padding:14px 22px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">Preview campaign</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  },
  {
    label: "Offer campaign",
    note: "Use high-contrast CTA with simple urgency.",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:28px;background:#f8f4ff;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center">
                <table width="620" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;background:#ffffff;border:1px solid #eadff8;border-radius:28px;overflow:hidden;">
                  <tr>
                    <td style="padding:30px 34px;">
                      <p style="margin:0 0 10px;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:#7c3aed;">Limited offer</p>
                      <h1 style="margin:0 0 14px;font-size:34px;line-height:1.1;color:#312e81;">48 hours. One simple action.</h1>
                      <p style="margin:0 0 20px;font-size:16px;line-height:1.75;color:#5b5f78;">
                        Share one offer, one deadline, and one clear next step.
                      </p>
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="border-radius:999px;background:#7c3aed;">
                            <a href="https://example.com" style="display:inline-block;padding:13px 22px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">Claim discount</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  },
  {
    label: "Welcome message",
    note: "Make first-time users feel at home.",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:28px;background:#eef6ff;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center">
                <table width="620" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;background:#ffffff;border:1px solid #dbeafe;border-radius:28px;overflow:hidden;">
                  <tr>
                    <td style="padding:32px 34px;">
                      <h1 style="margin:0 0 14px;font-size:33px;line-height:1.1;color:#1e3a8a;">Welcome to Email Studio</h1>
                      <p style="margin:0 0 18px;font-size:16px;line-height:1.75;color:#334155;">
                        Thanks for joining. Here are the first 3 steps to launch your first campaign quickly.
                      </p>
                      <ul style="margin:0 0 18px;padding-left:18px;color:#475569;font-size:15px;line-height:1.8;">
                        <li>Pick a template</li>
                        <li>Edit and preview</li>
                        <li>Send a test email</li>
                      </ul>
                      <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="border-radius:999px;background:#1d4ed8;">
                            <a href="https://example.com" style="display:inline-block;padding:13px 22px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">Get started</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  },
];

const points = [
  "HTML-first editing with an instant render panel.",
  "Focused test delivery to one or many recipients.",
  "A premium interface designed for real product teams.",
];

export default function Landing({ onStart }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const activeSlide = previewSlides[slideIndex];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % previewSlides.length);
    }, 4200);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="app-shell animated-light-bg min-h-screen text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 md:px-10 md:py-8">
        <header className="flex flex-col gap-4 rounded-[28px] border border-slate-200/70 bg-white/72 px-4 py-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-5">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold tracking-[0.24em] text-white sm:h-11 sm:w-11">
              M
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Email Studio</p>
              <p className="text-sm leading-5 text-slate-600">Email preview and test delivery</p>
            </div>
          </div>

          <button
            onClick={onStart}
            className="hidden rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:inline-flex"
          >
            Open App
          </button>
        </header>

        <section className="grid gap-10 py-10 sm:gap-14 sm:py-12 lg:grid-cols-[minmax(0,1fr)_560px] lg:items-center lg:gap-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Production-Ready Email Workspace</p>
            <h1 className="mt-4 max-w-[11ch] text-[2.2rem] leading-[1.02] tracking-[-0.03em] text-slate-900 sm:mt-6 sm:max-w-4xl sm:text-[2.8rem] sm:leading-[0.92] sm:tracking-normal md:text-5xl">
              <span className="font-display block leading-[0.98] sm:leading-none">Design clarity</span>
              <span className="block sm:inline">for teams that still </span>
              <span className="block text-slate-500 sm:inline">ship in HTML.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:mt-8 sm:text-lg sm:leading-9 md:text-xl">
              Email Studio gives email teams a calmer way to review campaigns: one place to write code, inspect the rendered result, and send polished test emails before anything goes live.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
              <button
                onClick={onStart}
                className="w-full rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 sm:w-auto"
              >
                Launch Email Studio
              </button>
            </div>

            <div className="mt-10 grid gap-3 sm:mt-14 sm:gap-4">
              {points.map((point) => (
                <div key={point} className="flex items-start gap-4 rounded-[24px] border border-slate-200/70 bg-white/70 p-4 sm:items-center sm:rounded-[28px] sm:p-6">
                  <div className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-900 sm:mt-0" />
                  <p className="text-sm leading-6 text-slate-600 sm:leading-7">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface overflow-hidden rounded-[28px] p-4 sm:rounded-[36px] sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5 sm:items-center">
              <div className="flex gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="min-w-0 text-right">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{activeSlide.label}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{activeSlide.note}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[22px] border border-slate-200 bg-white sm:rounded-[28px]">
              <iframe
                key={activeSlide.label}
                title="sample-preview"
                srcDoc={activeSlide.html}
                className="preview-fade h-[420px] w-full border-0 bg-white sm:h-[520px] lg:h-[620px]"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
