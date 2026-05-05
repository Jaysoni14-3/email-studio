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

export default function Landing({ onStart,  }) {
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
      <div className="mx-auto max-w-7xl px-6 py-6 md:px-10 md:py-8">
        <header className="flex items-center justify-between rounded-full border border-slate-200/70 bg-white/72 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold tracking-[0.24em] text-white">
              M
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Email Studio</p>
              <p className="text-sm text-slate-600">Email preview and test delivery</p>
            </div>
          </div>

          <button
            onClick={onStart}
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open App
          </button>
        </header>

        <section className="grid gap-20 py-16 lg:grid-cols-[minmax(0,1fr)_560px] lg:items-center ">
          <div className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Production-Ready Email Workspace</p>
            <h1 className="mt-6 max-w-4xl text-2xl leading-[0.92] text-slate-900 md:text-5xl">
              <span className="font-display">Design clarity</span>
              <span className="block">for teams that still</span>
              <span className="block text-slate-500">ship in HTML.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-9 text-slate-600 md:text-xl">
              Email Studio gives email teams a calmer way to review campaigns: one place to write code, inspect the rendered result, and send polished test emails before anything goes live.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={onStart}
                className="rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Launch Email Studio
              </button>
              {/* <button onClick={onOpenVisualBuilder} className="rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"> */}
                 {/* Open Visual Builder */}
              {/* </button>  */}
            </div>

            <div className="mt-14 grid gap-4 grid-cols-1">
              {points.map((point) => (
                <div key={point} className="flex flex-row items-center gap-4 rounded-[28px] border border-slate-200/70 bg-white/70 p-6">
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                  <p className=" text-sm leading-7 text-slate-600">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface overflow-hidden rounded-[36px] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{activeSlide.label}</p>
                <p className="mt-1 text-xs text-slate-500">{activeSlide.note}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
              <iframe
                key={activeSlide.label}
                title="sample-preview"
                srcDoc={activeSlide.html}
                className="preview-fade h-[620px] w-full border-0 bg-white"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
