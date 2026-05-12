import { useState } from "react";

export default function ControlPanel({
  subject,
  setSubject,
  wrap,
  setWrap,
  recipientInput,
  setRecipientInput,
  onRecipientKeyDown,
  recipients,
  savedRecipients,
  addRecipients,
  removeRecipient,
  restoreSavedRecipient,
  removeSavedRecipient,
  validRecipients,
  invalidRecipients,
  templates,
  applyTemplate,
  onSend,
  isSending,
  validationResult,
}) {
  const [templatesOpen, setTemplatesOpen] = useState(true);
  const [savedRecipientsOpen, setSavedRecipientsOpen] = useState(true);

  return (
    <aside className="surface min-h-full rounded-[28px] bg-[#fcfbf8] md:rounded-[0_32px_32px_0]">
      <div className="space-y-10 p-5 sm:p-6 md:space-y-12 md:p-10">
        <section className="soft-enter">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Step 1</p>
          <h2 className="mt-2 text-[1.45rem] leading-tight text-slate-900 sm:text-[1.75rem]">
            <span className="font-display">Choose who gets the test</span>
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Type an email, press Enter or tap Add, then send. Saved addresses can be reused any time.
          </p>

          <div className="mt-6 border-t border-slate-200 pt-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Recipients</p>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Email subject</span>
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Example: New collection is live"
                className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
              />
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input
                value={recipientInput}
                onChange={(event) => setRecipientInput(event.target.value)}
                onKeyDown={onRecipientKeyDown}
                placeholder="Enter one or more emails"
                className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
              />
              <button
                type="button"
                onClick={addRecipients}
                className="micro-interactive rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 sm:shrink-0"
              >
                Add
              </button>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Selected for this send
              </p>

              {recipients.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {recipients.map((email) => (
                    <button
                      type="button"
                      key={email}
                      onClick={() => removeRecipient(email)}
                      className={`micro-interactive rounded-full px-3 py-1.5 text-sm ${
                        validRecipients.includes(email) ? "bg-slate-100 text-slate-700" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {email} ×
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  No recipients selected yet.
                </p>
              )}
            </div>

            {savedRecipients.length > 0 ? (
              <div className="mt-6 border-t border-slate-200 pt-6">
                <button
                  type="button"
                  onClick={() => setSavedRecipientsOpen((current) => !current)}
                  className="micro-interactive flex w-full items-center justify-between gap-3 text-left"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Saved for later
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Reuse saved email addresses without typing them again.
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-500">
                    {savedRecipientsOpen ? "Hide" : "Show"}
                  </span>
                </button>

                {savedRecipientsOpen ? (
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {savedRecipients.map((email) => (
                      <div
                        key={`saved_${email}`}
                        className="flex items-center overflow-hidden rounded-full border border-slate-200 bg-white"
                      >
                        <button
                          type="button"
                          onClick={() => restoreSavedRecipient(email)}
                          className="micro-interactive px-3 py-1.5 text-sm text-slate-700"
                        >
                          {email}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSavedRecipient(email)}
                          className="micro-interactive border-l border-slate-200 px-2.5 py-1.5 text-sm text-slate-400 hover:text-rose-600"
                          aria-label={`Remove ${email} from saved recipients`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Expand to see saved recipients.
                  </p>
                )}
              </div>
            ) : null}

            {invalidRecipients.length > 0 ? (
              <p className="mt-5 text-sm leading-6 text-amber-800">
                A few addresses need fixing before sending.
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onSend}
            disabled={isSending}
            className="micro-interactive mt-6 w-full rounded-full bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? "Sending test email..." : "Send test email now"}
          </button>

          <label className="mt-5 flex items-start gap-3 rounded-[20px] bg-white px-4 py-4">
            <input
              type="checkbox"
              checked={wrap}
              onChange={(event) => setWrap(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
            />
            <span className="text-sm leading-6 text-slate-600">
              Add a ready-made email frame around your HTML so it looks more like a real email in preview and test sends.
            </span>
          </label>

          {validationResult.counts.critical > 0 || validationResult.counts.warning > 0 ? (
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Validation issues are shown in the editor for review only. Even critical findings like `&lt;div&gt;` usage will not block test sends.
            </p>
          ) : null}
        </section>

        <section className="soft-enter border-t border-slate-200 pt-8 md:pt-10">
          <button
            type="button"
            onClick={() => setTemplatesOpen((current) => !current)}
            className="micro-interactive flex w-full items-center justify-between gap-3 text-left"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Quick start</p>
              <h2 className="mt-2 text-[1.45rem] leading-tight text-slate-900 sm:text-[1.75rem]">
                <span className="font-display">Use a ready-made draft</span>
              </h2>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-slate-500">
              {templatesOpen ? "Hide" : "Show"}
            </span>
          </button>

          {templatesOpen ? (
            <>
              <p className="mt-3 text-sm leading-7 text-slate-600">Pick a template to fill the editor instantly.</p>

              <div className="mt-6 space-y-4">
                {templates.map((template) => (
                  <button
                    type="button"
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="micro-interactive surface-card w-full rounded-[22px] border border-slate-200 bg-white px-4 py-[18px] text-left transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <p className="text-sm font-semibold text-slate-900">{template.name}</p>
                    <p className="mt-1.5 text-sm leading-6 text-slate-500">{template.description}</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Expand to see templates.
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}
