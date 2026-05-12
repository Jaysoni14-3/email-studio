import { statusStyles } from "./builderData";

export default function StatusPanel({
  status,
  sendResults,
  serverInfo,
  isCheckingHealth,
}) {
  return (
    <section className="surface rounded-[28px] bg-[#fcfbf8] p-5 sm:p-6 md:rounded-[32px] md:p-8">
      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Additional info</p>
      <h2 className="mt-2 text-[1.45rem] leading-tight text-slate-900 sm:text-[1.75rem]">
        <span className="font-display">Connection and delivery status</span>
      </h2>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
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
      </div>

      {status.message ? (
        <div className={`mt-4 rounded-[22px] px-4 py-4 text-sm leading-6 ${statusStyles[status.type] || statusStyles.idle}`}>
          {status.message}
        </div>
      ) : null}

      {sendResults.length > 0 ? (
        <div className="mt-4 space-y-2">
          {sendResults.map((result) => (
            <div
              key={result.email}
              className={`rounded-[18px] px-4 py-3 text-sm ${
                result.success ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
              }`}
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className="break-all sm:truncate">{result.email}</span>
                <span>{result.success ? `Sent (${result.statusCode})` : "Not sent"}</span>
              </div>
              {!result.success && result.message ? (
                <p className="mt-1 text-xs leading-5 opacity-80">{result.message}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
