import { useMemo, useState } from "react";

import VisualEmailBuilder from "./builder/VisualEmailBuilder";
import { createDefaultBlocks, renderBlocksToEmailHtml } from "./builder/visualBuilderData";
import { wrapEmail } from "../utils/emailWrapper";

export default function VisualBuilderStudio({ onBack }) {
  const [blocks, setBlocks] = useState(createDefaultBlocks);
  const [previewWidth, setPreviewWidth] = useState("desktop");
  const [wrap, setWrap] = useState(true);

  const html = useMemo(() => renderBlocksToEmailHtml(blocks), [blocks]);
  const previewDocument = useMemo(() => wrapEmail(html, wrap), [html, wrap]);

  return (
    <div className="builder-page min-h-screen text-slate-900">
      <header className="border-b border-slate-200/90 bg-white/70 px-5 py-4 backdrop-blur md:px-8 md:py-5">
        <div className="mx-auto flex w-full max-w-[1760px] items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="micro-interactive rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium"
          >
            Back
          </button>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs">
              <input type="checkbox" checked={wrap} onChange={(event) => setWrap(event.target.checked)} />
              Wrap for email shell
            </label>
            <div className="flex rounded-full border border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setPreviewWidth("desktop")}
                className={`micro-interactive rounded-full px-3 py-1.5 text-xs font-semibold ${
                  previewWidth === "desktop" ? "bg-slate-900 text-white" : "text-slate-500"
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewWidth("mobile")}
                className={`micro-interactive rounded-full px-3 py-1.5 text-xs font-semibold ${
                  previewWidth === "mobile" ? "bg-slate-900 text-white" : "text-slate-500"
                }`}
              >
                Mobile
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1760px] gap-6 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(340px,520px)]">
        <section className="rounded-[24px] border border-slate-200 bg-[#fffdfa] p-4 md:p-6">
          <p className="mb-4 text-sm font-medium text-slate-600">Visual email builder (table-based, inline styles)</p>
          <VisualEmailBuilder blocks={blocks} setBlocks={setBlocks} />
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-4 md:p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Live preview</p>
          <div className="max-h-[80vh] overflow-y-auto rounded-[18px] border border-slate-200">
            <div className={`mx-auto ${previewWidth === "mobile" ? "w-[390px] max-w-full" : "w-full"}`}>
              <iframe title="visual-preview" srcDoc={previewDocument} className="h-[1000px] w-full border-0 bg-white" />
            </div>
          </div>
          <label className="mt-4 block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Generated HTML
            </span>
            <textarea
              readOnly
              value={html}
              rows={12}
              className="w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-700"
            />
          </label>
        </section>
      </main>
    </div>
  );
}
