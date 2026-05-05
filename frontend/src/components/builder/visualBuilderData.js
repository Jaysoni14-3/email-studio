const uid = () => `blk_${Math.random().toString(36).slice(2, 10)}`;

export const createDefaultBlocks = () => [
  {
    id: uid(),
    type: "text",
    text: "Welcome to Email Studio. Build email campaigns faster with a visual editor.",
    align: "left",
    fontSize: 16,
    fontWeight: 400,
    color: "#374151",
    paddingTop: 8,
    paddingBottom: 16,
  },
  {
    id: uid(),
    type: "button",
    text: "Get Started",
    href: "https://example.com",
    align: "left",
    textColor: "#ffffff",
    bgColor: "#111827",
    fontSize: 14,
    fontWeight: 600,
    paddingTop: 8,
    paddingBottom: 20,
  },
];

export const newBlock = (type) => {
  if (type === "image") {
    return {
      id: uid(),
      type: "image",
      src: "https://via.placeholder.com/560x220.png?text=Email+Image",
      alt: "Email visual",
      href: "",
      width: 560,
      align: "center",
      paddingTop: 8,
      paddingBottom: 16,
    };
  }

  if (type === "spacer") {
    return {
      id: uid(),
      type: "spacer",
      height: 24,
    };
  }

  if (type === "button") {
    return {
      id: uid(),
      type: "button",
      text: "Call to Action",
      href: "https://example.com",
      align: "left",
      textColor: "#ffffff",
      bgColor: "#111827",
      fontSize: 14,
      fontWeight: 600,
      paddingTop: 8,
      paddingBottom: 16,
    };
  }

  return {
    id: uid(),
    type: "text",
    text: "Add your text here.",
    align: "left",
    fontSize: 16,
    fontWeight: 400,
    color: "#374151",
    paddingTop: 8,
    paddingBottom: 16,
  };
};

const renderTextBlock = (block) => `
  <tr>
    <td style="padding:${block.paddingTop || 0}px 0 ${block.paddingBottom || 0}px;text-align:${block.align || "left"};">
      <div style="font-size:${block.fontSize || 16}px;line-height:1.7;font-weight:${block.fontWeight || 400};color:${block.color || "#374151"};">
        ${block.text || ""}
      </div>
    </td>
  </tr>
`;

const renderButtonBlock = (block) => `
  <tr>
    <td style="padding:${block.paddingTop || 0}px 0 ${block.paddingBottom || 0}px;text-align:${block.align || "left"};">
      <table cellpadding="0" cellspacing="0" border="0" style="display:inline-table;">
        <tr>
          <td style="border-radius:999px;background:${block.bgColor || "#111827"};">
            <a href="${block.href || "https://example.com"}" style="display:inline-block;padding:12px 20px;text-decoration:none;color:${block.textColor || "#ffffff"};font-size:${block.fontSize || 14}px;font-weight:${block.fontWeight || 600};">
              ${block.text || "Call to Action"}
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`;

const renderImageBlock = (block) => {
  const image = `<img src="${block.src || ""}" alt="${block.alt || ""}" width="${block.width || 560}" style="display:block;width:100%;max-width:${block.width || 560}px;height:auto;border:0;" />`;
  const wrappedImage = block.href ? `<a href="${block.href}" style="text-decoration:none;">${image}</a>` : image;
  return `
    <tr>
      <td style="padding:${block.paddingTop || 0}px 0 ${block.paddingBottom || 0}px;text-align:${block.align || "center"};">
        ${wrappedImage}
      </td>
    </tr>
  `;
};

const renderSpacerBlock = (block) => `
  <tr>
    <td style="font-size:0;line-height:0;height:${block.height || 24}px;">&nbsp;</td>
  </tr>
`;

export const renderBlocksToEmailHtml = (blocks) => {
  const renderedBlocks = (Array.isArray(blocks) ? blocks : []).map((block) => {
    if (block.type === "button") return renderButtonBlock(block);
    if (block.type === "image") return renderImageBlock(block);
    if (block.type === "spacer") return renderSpacerBlock(block);
    return renderTextBlock(block);
  });

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr>
        <td align="center" style="padding:0;">
          <table width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;border-collapse:collapse;">
            ${renderedBlocks.join("\n")}
          </table>
        </td>
      </tr>
    </table>
  `.trim();
};
