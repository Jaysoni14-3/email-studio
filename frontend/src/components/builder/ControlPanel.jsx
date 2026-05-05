import { statusStyles } from "./builderData";

export default function ControlPanel({
  subject,
  setSubject,
  wrap,
  setWrap,
  recipientInput,
  setRecipientInput,
  recipients,
  addRecipients,
  removeRecipient,
  validRecipients,
  invalidRecipients,
  templates,
  applyTemplate,
  status,
  sendResults,
  serverInfo,
  isCheckingHealth,
  onSend,
  isSending,
  canSend,
  validationResult,
}) {
  return (
    <aside className="surface min-h-full rounded-[32px] bg-[#fcfbf8] md:rounded-[0_32px_32px_0]">
      <div className="space-y-12 p-7 md:p-10">
        <section className="soft-enter">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Step 1</p>
          <h2 className="mt-2 text-[1.75rem] leading-tight text-slate-900">
            <span className="font-display">Basic email details</span>
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Set the email title and choose how it should be previewed.</p>

          <label className="mt-6 block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Email subject</span>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Example: New collection is live"
              className="w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
            />
          </label>

          <label className="mt-5 flex items-start gap-3 rounded-[20px] bg-white px-4 py-4">
            <input
              type="checkbox"
              checked={wrap}
              onChange={(event) => setWrap(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
            />
            <span className="text-sm leading-6 text-slate-600">
              Show this inside a full email layout before previewing and sending.
            </span>
          </label>

          <button
            type="button"
            onClick={onSend}
            disabled={!canSend || isSending}
            className="micro-interactive mt-6 w-full rounded-full bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSending ? "Sending test email..." : "Send test email now"}
          </button>

          {validationResult.counts.critical > 0 ? (
            <p className="mt-3 text-sm leading-6 text-rose-700">
              Resolve the critical HTML validation issues before sending a test email.
            </p>
          ) : null}
        </section>

        <section className="soft-enter border-t border-slate-200 pt-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Step 2</p>
              <h2 className="mt-2 text-[1.75rem] leading-tight text-slate-900">
                <span className="font-display">Who should receive the test</span>
              </h2>
            </div>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Add one or more email addresses. Click an address chip to remove it.
          </p>

          <textarea
            value={recipientInput}
            onChange={(event) => setRecipientInput(event.target.value)}
            rows={2}
            placeholder="name@example.com, another@example.com"
            className="mt-6 w-full resize-none rounded-[18px] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100"
          />

          <button
            type="button"
            onClick={addRecipients}
            className="micro-interactive mt-5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add people
          </button>

          <div className="mt-6 flex flex-wrap gap-2.5">
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

          {invalidRecipients.length > 0 ? (
            <p className="mt-5 text-sm leading-6 text-amber-800">
              A few addresses need fixing before sending.
            </p>
          ) : null}
        </section>

        <section className="soft-enter border-t border-slate-200 pt-10">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Quick start</p>
          <h2 className="mt-2 text-[1.75rem] leading-tight text-slate-900">
            <span className="font-display">Use a ready-made draft</span>
          </h2>
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
        </section>

        <section className="soft-enter border-t border-slate-200 pt-10">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Additional info</p>
          <h2 className="mt-2 text-[1.75rem] leading-tight text-slate-900">
            <span className="font-display">Connection and delivery status</span>
          </h2>

          <div className="mt-6 space-y-5">
            <div className="surface-card rounded-[22px] bg-white px-4 py-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Server</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {isCheckingHealth ? "Checking connection..." : serverInfo.reachable ? "Connected" : "Not available"}
              </p>
            </div>

            <div className="surface-card rounded-[22px] bg-white px-4 py-4">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">From address</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {serverInfo.configured
                  ? `${serverInfo.fromName || "Email Studio"} <${serverInfo.fromEmail}>`
                  : "Email sending is not configured yet."}
              </p>
            </div>

            {status.message ? (
              <div className={`rounded-[22px] px-4 py-4 text-sm leading-6 ${statusStyles[status.type] || statusStyles.idle}`}>
                {status.message}
              </div>
            ) : null}

            {sendResults.length > 0 ? (
              <div className="space-y-2">
                {sendResults.map((result) => (
                  <div
                    key={result.email}
                    className={`rounded-[18px] px-4 py-3 text-sm ${
                      result.success ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate">{result.email}</span>
                      <span>{result.success ? `Sent (${result.statusCode})` : "Not sent"}</span>
                    </div>
                    {!result.success && result.message ? (
                      <p className="mt-1 text-xs leading-5 opacity-80">{result.message}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </aside>
  );
}
