import { useMemo, useState } from "react";

import { newBlock } from "./visualBuilderData";

const blockName = {
  text: "Text",
  button: "Button",
  image: "Image",
  spacer: "Spacer",
};

export default function VisualEmailBuilder({ blocks, setBlocks }) {
  const [selectedId, setSelectedId] = useState(blocks[0]?.id || null);
  const [draggedId, setDraggedId] = useState(null);
  const selectedBlock = useMemo(
    () => blocks.find((item) => item.id === selectedId) || null,
    [blocks, selectedId]
  );

  const updateBlock = (id, patch) => {
    setBlocks((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const addBlock = (type) => {
    const block = newBlock(type);
    setBlocks((current) => [...current, block]);
    setSelectedId(block.id);
  };

  const removeSelected = () => {
    if (!selectedBlock) return;
    setBlocks((current) => current.filter((item) => item.id !== selectedBlock.id));
    setSelectedId((current) => (current === selectedBlock.id ? null : current));
  };

  const onDropOn = (targetId) => {
    if (!draggedId || draggedId === targetId) return;
    setBlocks((current) => {
      const fromIndex = current.findIndex((item) => item.id === draggedId);
      const toIndex = current.findIndex((item) => item.id === targetId);
      if (fromIndex < 0 || toIndex < 0) return current;
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-3">
        <div className="rounded-[16px] border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => addBlock("text")} className="micro-interactive rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold">
              + Text
            </button>
            <button type="button" onClick={() => addBlock("button")} className="micro-interactive rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold">
              + Button
            </button>
            <button type="button" onClick={() => addBlock("image")} className="micro-interactive rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold">
              + Image
            </button>
            <button type="button" onClick={() => addBlock("spacer")} className="micro-interactive rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold">
              + Spacer
            </button>
          </div>
        </div>

        <div className="space-y-2 rounded-[16px] border border-slate-200 bg-white p-3">
          {blocks.map((block) => (
            <button
              key={block.id}
              type="button"
              draggable
              onDragStart={() => setDraggedId(block.id)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => onDropOn(block.id)}
              onClick={() => setSelectedId(block.id)}
              className={`w-full rounded-[14px] border px-3 py-3 text-left text-sm transition ${
                selectedId === block.id
                  ? "border-slate-900 bg-slate-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="font-semibold text-slate-800">{blockName[block.type] || "Block"}</p>
              <p className="mt-1 text-xs text-slate-500">Drag to reorder</p>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[16px] border border-slate-200 bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Block settings</p>
          <button type="button" onClick={removeSelected} className="micro-interactive rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700">
            Delete
          </button>
        </div>

        {!selectedBlock ? (
          <p className="text-sm text-slate-500">Select a block to edit its settings.</p>
        ) : (
          <div className="space-y-3">
            {(selectedBlock.type === "text" || selectedBlock.type === "button") ? (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Text</span>
                <textarea
                  rows={3}
                  value={selectedBlock.text || ""}
                  onChange={(event) => updateBlock(selectedBlock.id, { text: event.target.value })}
                  className="w-full rounded-[12px] border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
            ) : null}

            {selectedBlock.type === "image" ? (
              <>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-500">Image URL</span>
                  <input
                    value={selectedBlock.src || ""}
                    onChange={(event) => updateBlock(selectedBlock.id, { src: event.target.value })}
                    className="w-full rounded-[12px] border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-500">Alt text</span>
                  <input
                    value={selectedBlock.alt || ""}
                    onChange={(event) => updateBlock(selectedBlock.id, { alt: event.target.value })}
                    className="w-full rounded-[12px] border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
              </>
            ) : null}

            {(selectedBlock.type === "button" || selectedBlock.type === "image") ? (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Link URL</span>
                <input
                  value={selectedBlock.href || ""}
                  onChange={(event) => updateBlock(selectedBlock.id, { href: event.target.value })}
                  className="w-full rounded-[12px] border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
            ) : null}

            {(selectedBlock.type === "text" || selectedBlock.type === "button") ? (
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-500">Font size</span>
                  <input
                    type="number"
                    value={selectedBlock.fontSize || 14}
                    onChange={(event) =>
                      updateBlock(selectedBlock.id, { fontSize: Number(event.target.value) || 14 })
                    }
                    className="w-full rounded-[12px] border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-500">Weight</span>
                  <input
                    type="number"
                    value={selectedBlock.fontWeight || 400}
                    onChange={(event) =>
                      updateBlock(selectedBlock.id, { fontWeight: Number(event.target.value) || 400 })
                    }
                    className="w-full rounded-[12px] border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
              </div>
            ) : null}

            {selectedBlock.type === "text" ? (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Text color</span>
                <input
                  type="color"
                  value={selectedBlock.color || "#374151"}
                  onChange={(event) => updateBlock(selectedBlock.id, { color: event.target.value })}
                  className="h-10 w-full rounded-[12px] border border-slate-200 px-2"
                />
              </label>
            ) : null}

            {selectedBlock.type === "button" ? (
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-500">Text color</span>
                  <input
                    type="color"
                    value={selectedBlock.textColor || "#ffffff"}
                    onChange={(event) => updateBlock(selectedBlock.id, { textColor: event.target.value })}
                    className="h-10 w-full rounded-[12px] border border-slate-200 px-2"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-slate-500">Button color</span>
                  <input
                    type="color"
                    value={selectedBlock.bgColor || "#111827"}
                    onChange={(event) => updateBlock(selectedBlock.id, { bgColor: event.target.value })}
                    className="h-10 w-full rounded-[12px] border border-slate-200 px-2"
                  />
                </label>
              </div>
            ) : null}

            {selectedBlock.type === "spacer" ? (
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Spacer height</span>
                <input
                  type="number"
                  value={selectedBlock.height || 24}
                  onChange={(event) => updateBlock(selectedBlock.id, { height: Number(event.target.value) || 24 })}
                  className="w-full rounded-[12px] border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">Alignment</span>
              <select
                value={selectedBlock.align || "left"}
                onChange={(event) => updateBlock(selectedBlock.id, { align: event.target.value })}
                className="w-full rounded-[12px] border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Top spacing</span>
                <input
                  type="number"
                  value={selectedBlock.paddingTop || 0}
                  onChange={(event) =>
                    updateBlock(selectedBlock.id, { paddingTop: Number(event.target.value) || 0 })
                  }
                  className="w-full rounded-[12px] border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-500">Bottom spacing</span>
                <input
                  type="number"
                  value={selectedBlock.paddingBottom || 0}
                  onChange={(event) =>
                    updateBlock(selectedBlock.id, { paddingBottom: Number(event.target.value) || 0 })
                  }
                  className="w-full rounded-[12px] border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
