export function wrapEmail(html, shouldWrap = true) {
  const content = typeof html === "string" ? html.trim() : "";

  if (!content) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Email Preview</title>
        </head>
        <body style="margin:0;font-family:Arial,sans-serif;background:#edf2ff;padding:32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center">
                <table width="640" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border-radius:24px;">
                  <tr>
                    <td style="padding:48px 32px;text-align:center;color:#64748b;">
                      Start typing HTML to preview your email.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;
  }

  if (!shouldWrap || /<html[\s>]/i.test(content) || /<!doctype/i.test(content)) {
    return content;
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Preview</title>
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
  `;
}
