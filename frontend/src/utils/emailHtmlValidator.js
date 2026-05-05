const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const EMAIL_UNSUPPORTED_TAGS = ["script", "iframe", "form", "video", "audio", "canvas", "svg"];

const EMAIL_RISKY_PROPERTIES = [
  "animation",
  "aspect-ratio",
  "backdrop-filter",
  "filter",
  "float",
  "gap",
  "grid",
  "grid-template-columns",
  "grid-template-rows",
  "max-height",
  "min-height",
  "object-fit",
  "position",
  "transition",
  "transform",
];

const SEVERITY_RANK = {
  critical: 0,
  warning: 1,
  info: 2,
};

const COLOR_KEYWORDS = {
  black: "#000000",
  blue: "#0000ff",
  gray: "#808080",
  green: "#008000",
  red: "#ff0000",
  white: "#ffffff",
  yellow: "#ffff00",
};

const TEXT_SELECTOR = "p,div,span,td,th,a,li,h1,h2,h3,h4,h5,h6,button";

const createIssue = (severity, category, message, line = null, fix = null, code = null) => ({
  severity,
  category,
  message,
  line,
  fix,
  code,
});

const getLineMap = (content) => {
  const starts = [0];

  for (let index = 0; index < content.length; index += 1) {
    if (content[index] === "\n") {
      starts.push(index + 1);
    }
  }

  return starts;
};

const indexToLine = (lineMap, index) => {
  if (typeof index !== "number" || index < 0) return null;

  let low = 0;
  let high = lineMap.length - 1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (lineMap[middle] <= index) {
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return high + 1;
};

const normalizeColor = (value) => {
  const input = String(value || "").trim().toLowerCase();
  if (!input) return null;

  if (COLOR_KEYWORDS[input]) {
    return COLOR_KEYWORDS[input];
  }

  if (/^#[0-9a-f]{3}$/i.test(input)) {
    return `#${input[1]}${input[1]}${input[2]}${input[2]}${input[3]}${input[3]}`.toLowerCase();
  }

  if (/^#[0-9a-f]{6}$/i.test(input)) {
    return input.toLowerCase();
  }

  const rgbMatch = input.match(/^rgba?\(([^)]+)\)$/i);
  if (!rgbMatch) return null;

  const parts = rgbMatch[1]
    .split(",")
    .slice(0, 3)
    .map((part) => Number.parseInt(part.trim(), 10));

  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return null;
  }

  return `#${parts.map((part) => part.toString(16).padStart(2, "0")).join("")}`;
};

const getRelativeLuminance = (hexColor) => {
  const normalized = normalizeColor(hexColor);
  if (!normalized) return null;

  const channels = [1, 3, 5].map((index) => Number.parseInt(normalized.slice(index, index + 2), 16) / 255);
  const adjusted = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );

  return 0.2126 * adjusted[0] + 0.7152 * adjusted[1] + 0.0722 * adjusted[2];
};

const getContrastRatio = (foreground, background) => {
  const fg = getRelativeLuminance(foreground);
  const bg = getRelativeLuminance(background);
  if (fg === null || bg === null) return null;

  const lighter = Math.max(fg, bg);
  const darker = Math.min(fg, bg);
  return (lighter + 0.05) / (darker + 0.05);
};

const parseInlineStyle = (styleText) => {
  const declarations = [];
  const entries = String(styleText || "")
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean);

  for (const entry of entries) {
    const separatorIndex = entry.indexOf(":");
    if (separatorIndex === -1) {
      declarations.push({ property: entry.toLowerCase(), value: "", valid: false });
      continue;
    }

    const property = entry.slice(0, separatorIndex).trim().toLowerCase();
    const value = entry.slice(separatorIndex + 1).trim();
    declarations.push({
      property,
      value,
      valid: Boolean(property && value),
    });
  }

  return declarations;
};

const getStyleValue = (element, propertyName) => {
  const declarations = parseInlineStyle(element.getAttribute("style") || "");
  return declarations.find((declaration) => declaration.property === propertyName)?.value || "";
};

const getInheritedBackgroundColor = (element) => {
  let current = element;

  while (current) {
    const inlineBackground =
      getStyleValue(current, "background-color") || current.getAttribute("bgcolor") || "";
    if (normalizeColor(inlineBackground)) {
      return inlineBackground;
    }
    current = current.parentElement;
  }

  return "#ffffff";
};

const buildElementLocator = (content, document) => {
  const positionsByTag = new Map();
  const consumedByTag = new Map();
  const tagPattern = /<([a-zA-Z][\w:-]*)(?:\s[^<>]*?)?>/g;

  for (const match of content.matchAll(tagPattern)) {
    const fullTag = match[0];
    if (fullTag.startsWith("</")) continue;

    const tagName = match[1].toLowerCase();
    if (!positionsByTag.has(tagName)) {
      positionsByTag.set(tagName, []);
      consumedByTag.set(tagName, 0);
    }

    positionsByTag.get(tagName).push(match.index);
  }

  const lineMap = getLineMap(content);
  const lineCache = new WeakMap();

  const getElementLine = (element) => {
    if (!element) return null;
    if (lineCache.has(element)) return lineCache.get(element);

    const tagName = element.tagName.toLowerCase();
    const positions = positionsByTag.get(tagName) || [];
    const consumed = consumedByTag.get(tagName) || 0;
    const index = positions[Math.min(consumed, Math.max(positions.length - 1, 0))];
    const line = typeof index === "number" ? indexToLine(lineMap, index) : null;

    consumedByTag.set(tagName, consumed + 1);
    lineCache.set(element, line);
    return line;
  };

  return {
    lineMap,
    getLineFromIndex: (index) => indexToLine(lineMap, index),
    getElementLine,
  };
};

const createFix = (label) => ({ label });

const ensureDocument = (content) => {
  const existingDocument = safelyParseHtml(content);
  const bodyContent = existingDocument?.body?.innerHTML?.trim() || content.trim();
  const titleContent = existingDocument?.querySelector("title")?.textContent?.trim() || "Email Studio";
  const lang = existingDocument?.documentElement?.getAttribute("lang") || "en";

  return [
    "<!DOCTYPE html>",
    `<html lang="${lang}">`,
    "<head>",
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    '  <meta name="x-apple-disable-message-reformatting">',
    `  <title>${titleContent}</title>`,
    "</head>",
    "<body>",
    bodyContent,
    "</body>",
    "</html>",
  ].join("\n");
};

const ensureTagInHead = (content, tagPattern, tagMarkup) => {
  const normalized = ensureDocument(content);
  if (tagPattern.test(normalized)) return normalized;

  return normalized.replace(/<head(\s[^>]*)?>/i, (match) => `${match}\n  ${tagMarkup}`);
};

const ensureHtmlLang = (content) => {
  const normalized = ensureDocument(content);
  if (/<html[^>]*\slang=/i.test(normalized)) return normalized;
  return normalized.replace(/<html\b([^>]*)>/i, '<html$1 lang="en">');
};

const ensureDoctype = (content) => {
  const normalized = ensureDocument(content);
  if (/<!doctype/i.test(normalized)) return normalized;
  return `<!DOCTYPE html>\n${normalized}`;
};

const countAngleBrackets = (line) => ({
  open: (line.match(/</g) || []).length,
  close: (line.match(/>/g) || []).length,
});

export const applyEmailIssueFix = (html, issue) => {
  const content = typeof html === "string" ? html : "";

  switch (issue?.code) {
    case "missing-html-open":
    case "missing-html-close":
    case "missing-head-open":
    case "missing-head-close":
    case "missing-body-open":
    case "missing-body-close":
      return ensureDocument(content);
    case "missing-doctype":
      return ensureDoctype(content);
    case "missing-charset":
      return ensureTagInHead(content, /<meta[^>]+charset\s*=\s*["']?utf-8["']?/i, '<meta charset="utf-8">');
    case "missing-viewport":
      return ensureTagInHead(
        content,
        /<meta[^>]+name\s*=\s*["']viewport["']/i,
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n  <meta name="x-apple-disable-message-reformatting">'
      );
    case "missing-title":
      return ensureTagInHead(content, /<title[\s>][\s\S]*?<\/title>/i, "<title>Email Studio</title>");
    case "missing-lang":
      return ensureHtmlLang(content);
    case "unterminated-tag":
      return content
        .split("\n")
        .map((line) => {
          const counts = countAngleBrackets(line);
          if (/<[/!a-zA-Z]/.test(line) && counts.open > counts.close) {
            return `${line}>`;
          }
          return line;
        })
        .join("\n");
    default:
      return content;
  }
};

const collectDocumentStructureIssues = (content, document, locator) => {
  const issues = [];
  const htmlOpenMatch = content.match(/<html[\s>]/i);
  const htmlCloseMatch = content.match(/<\/html>/i);
  const headOpenMatch = content.match(/<head[\s>]/i);
  const headCloseMatch = content.match(/<\/head>/i);
  const bodyOpenMatch = content.match(/<body[\s>]/i);
  const bodyCloseMatch = content.match(/<\/body>/i);
  const doctypeMatch = content.match(/<!doctype/i);
  const charsetMatch = content.match(/<meta[^>]+charset\s*=\s*["']?utf-8["']?/i);
  const viewportMatch = content.match(/<meta[^>]+name\s*=\s*["']viewport["'][^>]+content\s*=\s*["'][^"']*width=device-width[^"']*initial-scale=1/i);
  const titleMatch = content.match(/<title[\s>][\s\S]*?<\/title>/i);

  if (!htmlOpenMatch) {
    issues.push(createIssue("critical", "HTML Validation", "HTML structure missing <html> tag.", 1, createFix("Add <html>"), "missing-html-open"));
  }

  if (!htmlCloseMatch) {
    issues.push(
      createIssue(
        "critical",
        "HTML Validation",
        "HTML structure missing </html> tag.",
        locator.getLineFromIndex(content.length - 1) || 1,
        createFix("Close </html>"),
        "missing-html-close"
      )
    );
  }

  if (!headOpenMatch) {
    issues.push(createIssue("critical", "HTML Validation", "HTML structure missing <head> tag.", 1, createFix("Add <head>"), "missing-head-open"));
  }

  if (!headCloseMatch) {
    issues.push(
      createIssue(
        "critical",
        "HTML Validation",
        "HTML structure missing </head> tag.",
        locator.getLineFromIndex(content.length - 1) || 1,
        createFix("Close </head>"),
        "missing-head-close"
      )
    );
  }

  if (!bodyOpenMatch) {
    issues.push(createIssue("critical", "HTML Validation", "HTML structure missing <body> tag.", 1, createFix("Add <body>"), "missing-body-open"));
  }

  if (!bodyCloseMatch) {
    issues.push(
      createIssue(
        "critical",
        "HTML Validation",
        "HTML structure missing </body> tag.",
        locator.getLineFromIndex(content.length - 1) || 1,
        createFix("Close </body>"),
        "missing-body-close"
      )
    );
  }

  if (!doctypeMatch) {
    issues.push(createIssue("warning", "HTML Validation", "No doctype declaration found.", 1, createFix("Add doctype"), "missing-doctype"));
  }

  if (!charsetMatch) {
    issues.push(createIssue("warning", "HTML Validation", "No UTF-8 charset declaration found.", 1, createFix("Add charset"), "missing-charset"));
  }

  if (!viewportMatch) {
    issues.push(createIssue("warning", "HTML Validation", "No mobile viewport meta detected.", 1, createFix("Add viewport"), "missing-viewport"));
  }

  if (!titleMatch) {
    issues.push(createIssue("warning", "HTML Validation", "No <title> element found.", 1, createFix("Add title"), "missing-title"));
  }

  if (document?.documentElement && !document.documentElement.getAttribute("lang")) {
    issues.push(
      createIssue(
        "warning",
        "HTML Validation",
        "No language declared on <html>.",
        htmlOpenMatch ? locator.getLineFromIndex(htmlOpenMatch.index) : 1,
        createFix("Add lang"),
        "missing-lang"
      )
    );
  }

  const divMatches = Array.from(content.matchAll(/<div[\s>]/gi));
  if (divMatches.length > 0) {
    const lineList = divMatches
      .map((match) => locator.getLineFromIndex(match.index))
      .filter((line) => line !== null)
      .join(", ");
    issues.push(
      createIssue(
        "warning",
        "HTML Validation",
        `${divMatches.length} <div> tag${divMatches.length === 1 ? "" : "s"} found. Table-based structure is more reliable across email clients.${lineList ? ` Found on line${divMatches.length === 1 ? "" : "s"}: ${lineList}.` : ""}`,
        locator.getLineFromIndex(divMatches[0].index)
      )
    );
  }

  const possibleUnterminatedLines = content
    .split("\n")
    .map((line, index) => ({ line, number: index + 1 }))
    .filter(({ line }) => /<[/!a-zA-Z]/.test(line) && !/>/.test(line));

  if (possibleUnterminatedLines.length > 0) {
    const lines = possibleUnterminatedLines.map(({ number }) => number).join(", ");
    issues.push(
      createIssue(
        "warning",
        "HTML Validation",
        `Possible unterminated HTML tag (missing ">") on line${possibleUnterminatedLines.length === 1 ? "" : "s"}: ${lines}.`,
        possibleUnterminatedLines[0].number,
        createFix('Add ">"'),
        "unterminated-tag"
      )
    );
  }

  return issues;
};

const collectTagBalanceIssues = (html, locator) => {
  const issues = [];
  const stack = [];
  const tagPattern = /<\/?([a-zA-Z][\w:-]*)(?:\s[^<>]*?)?\s*\/?>/g;

  for (const match of html.matchAll(tagPattern)) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const isClosing = fullTag.startsWith("</");
    const isSelfClosing = /\/>$/.test(fullTag) || VOID_TAGS.has(tagName);

    if (isClosing) {
      const topTag = stack[stack.length - 1];

      if (topTag === tagName) {
        stack.pop();
        continue;
      }

      const priorIndex = stack.lastIndexOf(tagName);
      if (priorIndex === -1) {
        issues.push(
          createIssue(
            "critical",
            "HTML",
            `Closing tag </${tagName}> does not match an open element.`,
            locator.getLineFromIndex(match.index)
          )
        );
        continue;
      }

      const missingClosures = stack.splice(priorIndex + 1);
      issues.push(
        createIssue(
          "critical",
          "HTML",
          `Tag nesting looks broken near </${tagName}>. Open tags without closure: ${missingClosures
            .map((name) => `<${name}>`)
            .join(", ")}.`
          ,
          locator.getLineFromIndex(match.index)
        )
      );
      stack.pop();
      continue;
    }

    if (!isSelfClosing) {
      stack.push(tagName);
    }
  }

  if (stack.length) {
    issues.push(
      createIssue(
        "critical",
        "HTML",
        `Some tags are left open: ${stack.slice(-4).map((name) => `<${name}>`).join(", ")}.`,
        locator.getLineFromIndex(html.length - 1)
      )
    );
  }

  return issues;
};

const safelyParseHtml = (html) => {
  if (typeof window === "undefined" || typeof window.DOMParser === "undefined") {
    return null;
  }

  try {
    return new window.DOMParser().parseFromString(html, "text/html");
  } catch {
    return null;
  }
};

const collectHtmlIssues = (content, shouldWrap, document, locator) => {
  const issues = [...collectDocumentStructureIssues(content, document, locator), ...collectTagBalanceIssues(content, locator)];
  const hasDoctype = /<!doctype/i.test(content);
  const hasHtmlTag = /<html[\s>]/i.test(content);
  const hasBodyTag = /<body[\s>]/i.test(content);
  const hasFullDocument = hasDoctype || hasHtmlTag || hasBodyTag;

  for (const tagName of EMAIL_UNSUPPORTED_TAGS) {
    const match = content.match(new RegExp(`<${tagName}[\\s>]`, "i"));
    if (match) {
      issues.push(
        createIssue(
          "critical",
          "HTML",
          `<${tagName}> is not reliably supported in email clients and should be removed.`,
          locator.getLineFromIndex(match.index)
        )
      );
    }
  }

  const stylesheetLinkMatch = content.match(/<link[\s>][^>]*rel=["']?stylesheet/i);
  if (stylesheetLinkMatch) {
    issues.push(
      createIssue(
        "critical",
        "CSS",
        "External stylesheets are ignored by many email clients. Inline critical styles instead.",
        locator.getLineFromIndex(stylesheetLinkMatch.index)
      )
    );
  }

  const styleTagMatch = content.match(/<style[\s>]/i);
  if (styleTagMatch) {
    issues.push(
      createIssue(
        "warning",
        "CSS",
        "Embedded <style> blocks are only partially supported across email clients.",
        locator.getLineFromIndex(styleTagMatch.index)
      )
    );
  }

  if (document && hasHtmlTag && !document.documentElement.getAttribute("lang")) {
    issues.push(
      createIssue(
        "warning",
        "Accessibility",
        "Add a lang attribute to the <html> element for screen readers.",
        locator.getElementLine(document.documentElement)
      )
    );
  }

  if (!/<table[\s>]/i.test(content) && /<(div|section|article|main|header|footer)[\s>]/i.test(content)) {
    issues.push(
      createIssue(
        "warning",
        "HTML",
        "This layout does not use tables. Table-based structure is still the safest choice across email clients.",
        locator.getLineFromIndex(content.search(/<(div|section|article|main|header|footer)[\s>]/i))
      )
    );
  }

  const vmlMatch = content.match(/<(v:roundrect|v:rect|o:officeDocumentSettings)/i);
  if (!/\[if\s+mso\]/i.test(content) && vmlMatch) {
    issues.push(
      createIssue(
        "warning",
        "HTML",
        "Outlook VML markup is present without matching MSO conditional comments.",
        locator.getLineFromIndex(vmlMatch.index)
      )
    );
  }

  if (document) {
    const body = document.body;
    if (body && !body.getAttribute("style") && !body.getAttribute("bgcolor") && !shouldWrap) {
      issues.push(
        createIssue(
          "info",
          "HTML",
          "The <body> element has no background or spacing styles. Some clients apply their own defaults.",
          locator.getElementLine(body)
        )
      );
    }
  }

  return issues;
};

const collectCssIssues = (content, document, locator) => {
  const issues = [];
  const styleSnippets = [];

  if (document) {
    document.querySelectorAll("[style]").forEach((element) => {
      styleSnippets.push({
        source: `<${element.tagName.toLowerCase()}>`,
        declarations: parseInlineStyle(element.getAttribute("style") || ""),
        line: locator.getElementLine(element),
      });
    });

    document.querySelectorAll("style").forEach((element) => {
      styleSnippets.push({
        source: "<style>",
        declarations: parseInlineStyle(element.textContent || ""),
        line: locator.getElementLine(element),
      });
    });
  } else {
    const matches = content.match(/style=["']([^"']+)["']/gi) || [];
    matches.forEach((match, index) => {
      const raw = match.replace(/^style=["']|["']$/gi, "");
      styleSnippets.push({
        source: `style attribute ${index + 1}`,
        declarations: parseInlineStyle(raw),
        line: locator.getLineFromIndex(content.indexOf(match)),
      });
    });
  }

  styleSnippets.forEach(({ source, declarations, line }) => {
    declarations.forEach((declaration) => {
      if (!declaration.valid) {
        issues.push(
          createIssue("warning", "CSS", `${source} contains a malformed CSS declaration: "${declaration.property}".`, line)
        );
        return;
      }

      if (EMAIL_RISKY_PROPERTIES.includes(declaration.property)) {
        issues.push(
          createIssue("warning", "CSS", `${source} uses ${declaration.property}, which has uneven support across email clients.`, line)
        );
      }

      if (declaration.property === "display" && /(flex|grid)/i.test(declaration.value)) {
        issues.push(
          createIssue("warning", "CSS", `${source} uses display:${declaration.value}, which is unreliable in many email clients.`, line)
        );
      }

      if (declaration.property === "position" && /(fixed|sticky|absolute)/i.test(declaration.value)) {
        issues.push(
          createIssue("warning", "CSS", `${source} uses position:${declaration.value}, which often breaks in email clients.`, line)
        );
      }

      if (declaration.property === "background-image") {
        issues.push(
          createIssue("warning", "CSS", `${source} uses background images, which render inconsistently across email clients.`, line)
        );
      }

      if (declaration.property === "font" || declaration.property === "background") {
        issues.push(
          createIssue(
            "info",
            "CSS",
            `${source} uses ${declaration.property} shorthand. Expanded properties are usually safer for HTML email.`,
            line
          )
        );
      }

      if (declaration.property === "margin" && /\bauto\b/i.test(declaration.value)) {
        issues.push(
          createIssue("warning", "CSS", `${source} uses margin:auto, which is inconsistent in email clients.`, line)
        );
      }
    });
  });

  return issues;
};

const collectImageIssues = (document, locator) => {
  if (!document) return [];

  const issues = [];
  const images = Array.from(document.querySelectorAll("img"));

  images.forEach((image, index) => {
    const label = `Image ${index + 1}`;
    const src = image.getAttribute("src") || "";
    const alt = image.getAttribute("alt") || "";
    const width = image.getAttribute("width") || "";
    const height = image.getAttribute("height") || "";
    const style = image.getAttribute("style") || "";
    const line = locator.getElementLine(image);

    if (!src.trim()) {
      issues.push(createIssue("critical", "Images", `${label} is missing a src attribute.`, line));
    } else if (/^http:\/\//i.test(src)) {
      issues.push(createIssue("warning", "Images", `${label} uses HTTP. Prefer HTTPS to avoid blocked content.`, line));
    } else if (!/^(https?:\/\/|cid:|data:image\/|\/)/i.test(src)) {
      issues.push(
        createIssue(
          "warning",
          "Images",
          `${label} uses a relative source. Absolute URLs or CID references are safer for sent emails.`,
          line
        )
      );
    }

    if (!alt.trim()) {
      issues.push(createIssue("warning", "Images", `${label} is missing alt text.`, line));
    }

    if (!width && !/width\s*:/.test(style)) {
      issues.push(createIssue("warning", "Images", `${label} should declare a width for predictable rendering.`, line));
    }

    if (!height && !/height\s*:/.test(style)) {
      issues.push(
        createIssue("info", "Images", `${label} has no explicit height. This is usually fine, but can affect some layouts.`, line)
      );
    }

    if (!/display\s*:\s*block/i.test(style)) {
      issues.push(
        createIssue("info", "Images", `${label} does not set display:block, which can leave gaps in some clients.`, line)
      );
    }
  });

  return issues;
};

const collectLinkIssues = (document, locator) => {
  if (!document) return [];

  const issues = [];
  const anchors = Array.from(document.querySelectorAll("a"));

  anchors.forEach((anchor, index) => {
    const label = `Link ${index + 1}`;
    const href = (anchor.getAttribute("href") || "").trim();
    const title = (anchor.getAttribute("title") || "").trim();
    const line = locator.getElementLine(anchor);

    if (!href) {
      issues.push(createIssue("critical", "Links", `${label} is missing an href attribute.`, line));
      return;
    }

    if (/^(javascript:|data:|file:)/i.test(href)) {
      issues.push(
        createIssue("critical", "Links", `${label} uses an unsafe or unsupported protocol: ${href.split(":")[0]}.`, line)
      );
    } else if (/^http:\/\//i.test(href)) {
      issues.push(createIssue("warning", "Links", `${label} uses HTTP. Prefer HTTPS for deliverability and security.`, line));
    } else if (!/^(https?:|mailto:|tel:|#)/i.test(href)) {
      issues.push(createIssue("warning", "Links", `${label} uses a relative URL. Absolute URLs are safer in sent emails.`, line));
    }

    if (/\s/.test(href)) {
      issues.push(createIssue("warning", "Links", `${label} contains whitespace and may be malformed.`, line));
    }

    if (!title && anchor.textContent?.trim().length === 0) {
      issues.push(createIssue("warning", "Links", `${label} has no readable text or title for assistive technologies.`, line));
    }

    if (anchor.querySelector("img") && !title && !(anchor.textContent || "").trim()) {
      issues.push(
        createIssue("info", "Links", `${label} wraps only an image. Consider adding a title or descriptive alt text.`, line)
      );
    }
  });

  return issues;
};

const collectFontIssues = (document, locator) => {
  if (!document) return [];

  const issues = [];
  const textElements = Array.from(document.querySelectorAll(TEXT_SELECTOR));

  if (document.querySelector("style")?.textContent?.match(/@font-face|fonts\.googleapis\.com/i)) {
    issues.push(
      createIssue(
        "warning",
        "Fonts",
        "Web fonts are only partially supported across email clients. Always define safe fallbacks.",
        locator.getElementLine(document.querySelector("style"))
      )
    );
  }

  textElements.forEach((element, index) => {
    const label = `${element.tagName.toLowerCase()} ${index + 1}`;
    const fontSize = getStyleValue(element, "font-size");
    const lineHeight = getStyleValue(element, "line-height");
    const fontFamily = getStyleValue(element, "font-family");
    const line = locator.getElementLine(element);

    const fontSizePx = Number.parseFloat(fontSize);
    if (fontSize.endsWith("px") && !Number.isNaN(fontSizePx) && fontSizePx < 12) {
      issues.push(createIssue("warning", "Fonts", `${label} uses ${fontSize}. Small text is harder to read on mobile email clients.`, line));
    }

    const lineHeightValue = Number.parseFloat(lineHeight);
    if (lineHeight.endsWith("px") && !Number.isNaN(lineHeightValue) && !Number.isNaN(fontSizePx) && lineHeightValue < fontSizePx * 1.2) {
      issues.push(createIssue("warning", "Fonts", `${label} has a tight line-height (${lineHeight}) that may hurt readability.`, line));
    }

    if (/^[^,]+$/i.test(fontFamily) && !/(arial|helvetica|georgia|times|verdana|tahoma|trebuchet|sans-serif|serif)/i.test(fontFamily)) {
      issues.push(createIssue("warning", "Fonts", `${label} declares a single custom font without a fallback stack.`, line));
    }
  });

  return issues;
};

const collectAccessibilityIssues = (document, locator) => {
  if (!document) return [];

  const issues = [];
  const headings = Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6"));
  let previousLevel = 0;

  headings.forEach((heading, index) => {
    const level = Number.parseInt(heading.tagName.slice(1), 10);
    if (index === 0 && level !== 1) {
      issues.push(
        createIssue(
          "warning",
          "Accessibility",
          "Start the content hierarchy with an <h1> when headings are used.",
          locator.getElementLine(heading)
        )
      );
    }

    if (previousLevel && level > previousLevel + 1) {
      issues.push(
        createIssue(
          "warning",
          "Accessibility",
          `Heading structure skips from <h${previousLevel}> to <h${level}>, which can confuse screen readers.`,
          locator.getElementLine(heading)
        )
      );
    }

    previousLevel = level;
  });

  const layoutTables = Array.from(document.querySelectorAll("table")).filter(
    (table) => !table.querySelector("th") && !table.querySelector("caption")
  );

  if (layoutTables.some((table) => table.getAttribute("role") !== "presentation")) {
    issues.push(
      createIssue(
        "info",
        "Accessibility",
        "Add role=\"presentation\" to layout tables to reduce screen reader noise.",
        locator.getElementLine(layoutTables.find((table) => table.getAttribute("role") !== "presentation"))
      )
    );
  }

  return issues;
};

const collectMobileAndViewportIssues = (content, document, shouldWrap, locator) => {
  const issues = [];
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(content);

  if (!shouldWrap && /<html[\s>]/i.test(content) && !hasViewport) {
    issues.push(createIssue("warning", "Viewport", "Add a viewport meta tag so mobile clients scale the email more predictably.", 1));
  }

  if (document) {
    const wideTables = Array.from(document.querySelectorAll("table[width]")).filter((table) => {
      const rawWidth = table.getAttribute("width") || "";
      const numericWidth = Number.parseFloat(rawWidth);
      return !rawWidth.includes("%") && !Number.isNaN(numericWidth) && numericWidth > 600;
    });

    if (wideTables.length > 0) {
      issues.push(
        createIssue(
          "warning",
          "Mobile",
          "One or more tables are wider than 600px, which can create horizontal scrolling on mobile.",
          locator.getElementLine(wideTables[0])
        )
      );
    }

    const wideImages = Array.from(document.querySelectorAll("img[width]")).filter((image) => {
      const numericWidth = Number.parseFloat(image.getAttribute("width") || "");
      return !Number.isNaN(numericWidth) && numericWidth > 600;
    });

    if (wideImages.length > 0) {
      issues.push(
        createIssue(
          "warning",
          "Mobile",
          "One or more images are wider than 600px and may need responsive constraints.",
          locator.getElementLine(wideImages[0])
        )
      );
    }

    const touchTargets = Array.from(document.querySelectorAll("a")).filter((anchor) => {
      const style = anchor.getAttribute("style") || "";
      const fontSize = Number.parseFloat(getStyleValue(anchor, "font-size"));
      const paddingTop = Number.parseFloat(getStyleValue(anchor, "padding-top"));
      const paddingBottom = Number.parseFloat(getStyleValue(anchor, "padding-bottom"));
      const shorthandPadding = getStyleValue(anchor, "padding");
      const hasShorthandPadding = /^\d+px(\s+\d+px){0,3}$/i.test(shorthandPadding);

      if (hasShorthandPadding) return false;
      if (Number.isNaN(fontSize) || Number.isNaN(paddingTop) || Number.isNaN(paddingBottom)) return false;

      return fontSize + paddingTop + paddingBottom < 36 && !/display\s*:\s*block|display\s*:\s*inline-block/i.test(style);
    });

    if (touchTargets.length > 0) {
      issues.push(
        createIssue(
          "warning",
          "Mobile",
          "Some CTA links may be too small for comfortable tapping on mobile devices.",
          locator.getElementLine(touchTargets[0])
        )
      );
    }

    const missingResponsiveImages = Array.from(document.querySelectorAll("img")).filter(
      (image) => !/max-width\s*:\s*100%/i.test(image.getAttribute("style") || "") && !image.getAttribute("width")
    );

    if (missingResponsiveImages.length > 0) {
      issues.push(
        createIssue(
          "info",
          "Mobile",
          "Some images do not declare width or responsive max-width styling.",
          locator.getElementLine(missingResponsiveImages[0])
        )
      );
    }
  }

  return issues;
};

const collectContrastIssues = (document, locator) => {
  if (!document) return [];

  const issues = [];
  const elements = Array.from(document.querySelectorAll(TEXT_SELECTOR));

  elements.forEach((element, index) => {
    const color = getStyleValue(element, "color");
    if (!normalizeColor(color)) return;

    const backgroundColor = getInheritedBackgroundColor(element);
    const ratio = getContrastRatio(color, backgroundColor);

    if (ratio !== null && ratio < 4.5) {
      issues.push(
        createIssue(
          "warning",
          "Contrast",
          `${element.tagName.toLowerCase()} ${index + 1} has low color contrast (${ratio.toFixed(2)}:1) against its background.`
          ,
          locator.getElementLine(element)
        )
      );
    }
  });

  return issues;
};

export function validateEmailHtml(html, shouldWrap = true) {
  const content = typeof html === "string" ? html.trim() : "";

  if (!content) {
    return {
      issues: [createIssue("warning", "HTML", "Add some HTML before validating email client compatibility.")],
      counts: { critical: 0, warning: 1, info: 0 },
    };
  }

  const document = safelyParseHtml(content);
  const locator = buildElementLocator(content, document);
  const issues = [
    ...collectHtmlIssues(content, shouldWrap, document, locator),
    ...collectCssIssues(content, document, locator),
    ...collectImageIssues(document, locator),
    ...collectLinkIssues(document, locator),
    ...collectFontIssues(document, locator),
    ...collectAccessibilityIssues(document, locator),
    ...collectMobileAndViewportIssues(content, document, shouldWrap, locator),
    ...collectContrastIssues(document, locator),
  ];

  const uniqueIssues = Array.from(
    new Map(issues.map((issue) => [`${issue.severity}:${issue.category}:${issue.message}`, issue])).values()
  ).sort((left, right) => {
    const severityDifference = SEVERITY_RANK[left.severity] - SEVERITY_RANK[right.severity];
    if (severityDifference !== 0) return severityDifference;
    return left.category.localeCompare(right.category);
  });

  const counts = uniqueIssues.reduce(
    (accumulator, issue) => {
      accumulator[issue.severity] += 1;
      return accumulator;
    },
    { critical: 0, warning: 0, info: 0 }
  );

  return {
    issues: uniqueIssues,
    counts,
  };
}
