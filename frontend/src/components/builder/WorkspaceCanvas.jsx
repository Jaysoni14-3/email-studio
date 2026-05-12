import { Editor } from "@monaco-editor/react";

export default function WorkspaceCanvas({
  html,
  setHtml,
  onFormat,
  onClear,
  previewWidth,
  setPreviewWidth,
  previewDocument,
  validationResult,
  onFixIssue,
}) {
  const { counts, issues } = validationResult;

  return (
    <section>
      <div className="flex flex-col">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-[#fcfbf8] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8 md:py-5">
          <span className="text-sm font-medium text-slate-500">Email content</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onFormat}
              className="micro-interactive rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clean format
            </button>
            <button
              type="button"
              onClick={onClear}
              className="micro-interactive rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="h-[52vh] min-h-[320px] border-b border-slate-200 sm:h-[560px] sm:min-h-[420px]">
            <Editor
              height="100%"
              defaultLanguage="html"
              value={html}
              onChange={(value) => setHtml(value || "")}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                padding: { top: 16 },
                smoothScrolling: true,
              }}
            />
          </div>

          <div className="border-b border-slate-200 bg-amber-50/40 px-4 py-5 sm:px-6 md:px-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Email HTML validation</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Checks for common email client compatibility problems before sending.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700">
                    {counts.critical} critical
                  </span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">
                    {counts.warning} warnings
                  </span>
                </div>
              </div>

              {issues.length > 0 ? (
                <div className="grid gap-2">
                  {issues.map((issue) => (
                    <div
                      key={`${issue.severity}_${issue.category}_${issue.message}`}
                      className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                        issue.severity === "critical"
                          ? "bg-rose-50 text-rose-800"
                          : "bg-amber-50 text-amber-900"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1">
                          <span className="font-semibold uppercase tracking-[0.08em]">{issue.severity}</span>
                          <span className="ml-2 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em]">
                            {issue.category}
                          </span>
                          {issue.line ? (
                            <span className="ml-2 rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold tracking-[0.08em]">
                              L{issue.line}
                            </span>
                          ) : null}
                          <span className="ml-2">{issue.message}</span>
                        </div>
                        {issue.fix ? (
                          <button
                            type="button"
                            onClick={() => onFixIssue(issue)}
                            className="micro-interactive rounded-full border border-current/20 bg-white/80 px-3 py-1 text-xs font-semibold transition hover:bg-white"
                          >
                            {issue.fix.label}
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  No common email client compatibility issues found in this HTML.
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#fffdfa] p-4 sm:p-6 md:sticky md:top-4 md:z-10 md:p-8">
            <div className="rounded-[20px] border border-slate-200/80 bg-[#fffdfa]/95 p-4 backdrop-blur-sm">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Live preview</p>
                <div className="flex w-full rounded-full border border-slate-200 bg-white p-1 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setPreviewWidth("desktop")}
                    className={`micro-interactive flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:flex-none ${
                      previewWidth === "desktop" ? "bg-slate-900 text-white" : "text-slate-500"
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewWidth("mobile")}
                    className={`micro-interactive flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:flex-none ${
                      previewWidth === "mobile" ? "bg-slate-900 text-white" : "text-slate-500"
                    }`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              <div className="max-h-[72vh] overflow-y-auto rounded-[18px] border border-slate-200 bg-white shadow-sm">
                <div
                  className={`mx-auto transition-all duration-300 ${
                    previewWidth === "mobile" ? "w-full max-w-[390px]" : "w-full"
                  }`}
                >
                  <iframe
                    title="email-preview"
                    srcDoc={previewDocument}
                    className="h-[560px] w-full border-0 bg-white sm:h-[720px] md:h-[900px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
