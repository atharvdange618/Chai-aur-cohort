const customStyles = {
  // Padding
  "chai-p-0": "padding: 0px",
  "chai-p-1": "padding: 4px",
  "chai-p-2": "padding: 8px",
  "chai-p-3": "padding: 12px",
  "chai-p-4": "padding: 16px",
  "chai-p-6": "padding: 24px",
  "chai-p-8": "padding: 32px",

  "chai-px-2": "padding-left: 8px; padding-right: 8px",
  "chai-px-4": "padding-left: 16px; padding-right: 16px",
  "chai-py-2": "padding-top: 8px; padding-bottom: 8px",
  "chai-py-4": "padding-top: 16px; padding-bottom: 16px",

  // Margin
  "chai-m-0": "margin: 0px",
  "chai-m-1": "margin: 4px",
  "chai-m-2": "margin: 8px",
  "chai-m-4": "margin: 16px",
  "chai-m-8": "margin: 32px",
  "chai-mx-auto": "margin-left: auto; margin-right: auto",
  "chai-mt-4": "margin-top: 16px",
  "chai-mb-4": "margin-bottom: 16px",

  // Width / Height
  "chai-w-full": "width: 100%",
  "chai-w-half": "width: 50%",
  "chai-w-screen": "width: 100vw",
  "chai-h-full": "height: 100%",
  "chai-h-screen": "height: 100vh",
  "chai-max-w-lg": "max-width: 512px",
  "chai-max-w-xl": "max-width: 768px",

  // Typography
  "chai-text-xs": "font-size: 12px; line-height: 16px",
  "chai-text-sm": "font-size: 14px; line-height: 20px",
  "chai-text-base": "font-size: 16px; line-height: 24px",
  "chai-text-lg": "font-size: 18px; line-height: 28px",
  "chai-text-xl": "font-size: 20px; line-height: 28px",
  "chai-text-2xl": "font-size: 24px; line-height: 32px",
  "chai-text-3xl": "font-size: 30px; line-height: 36px",
  "chai-text-4xl": "font-size: 36px; line-height: 40px",

  "chai-font-normal": "font-weight: 400",
  "chai-font-medium": "font-weight: 500",
  "chai-font-semibold": "font-weight: 600",
  "chai-font-bold": "font-weight: 700",

  "chai-italic": "font-style: italic",
  "chai-underline": "text-decoration: underline",
  "chai-uppercase": "text-transform: uppercase",
  "chai-text-center": "text-align: center",
  "chai-text-right": "text-align: right",
  "chai-tracking-wide": "letter-spacing: 0.05em",

  // Colors   text
  "chai-text-white": "color: #ffffff",
  "chai-text-black": "color: #000000",
  "chai-text-gray": "color: #6b7280",
  "chai-text-red": "color: #ef4444",
  "chai-text-green": "color: #22c55e",
  "chai-text-blue": "color: #3b82f6",
  "chai-text-orange": "color: #f97316",
  "chai-text-purple": "color: #a855f7",

  // Colors   background
  "chai-bg-white": "background-color: #ffffff",
  "chai-bg-black": "background-color: #000000",
  "chai-bg-gray": "background-color: #f3f4f6",
  "chai-bg-red": "background-color: #fee2e2",
  "chai-bg-green": "background-color: #dcfce7",
  "chai-bg-blue": "background-color: #dbeafe",
  "chai-bg-orange": "background-color: #fff7ed",
  "chai-bg-purple": "background-color: #f5f3ff",
  "chai-bg-dark": "background-color: #1e1e2e",

  // Border
  "chai-border": "border: 1px solid #d1d5db",
  "chai-border-2": "border: 2px solid #d1d5db",
  "chai-border-dark": "border: 2px solid #111827",
  "chai-rounded": "border-radius: 4px",
  "chai-rounded-md": "border-radius: 8px",
  "chai-rounded-lg": "border-radius: 12px",
  "chai-rounded-full": "border-radius: 9999px",

  // Shadow
  "chai-shadow":
    "box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
  "chai-shadow-md":
    "box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
  "chai-shadow-lg":
    "box-shadow: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)",

  // Flexbox
  "chai-flex": "display: flex",
  "chai-inline-flex": "display: inline-flex",
  "chai-flex-col": "flex-direction: column",
  "chai-flex-wrap": "flex-wrap: wrap",
  "chai-items-center": "align-items: center",
  "chai-items-start": "align-items: flex-start",
  "chai-justify-center": "justify-content: center",
  "chai-justify-between": "justify-content: space-between",
  "chai-justify-end": "justify-content: flex-end",
  "chai-gap-2": "gap: 8px",
  "chai-gap-4": "gap: 16px",
  "chai-gap-6": "gap: 24px",

  // Display / Overflow
  "chai-block": "display: block",
  "chai-inline": "display: inline",
  "chai-inline-block": "display: inline-block",
  "chai-hidden": "display: none",
  "chai-overflow-hidden": "overflow: hidden",
  "chai-cursor-pointer": "cursor: pointer",
  "chai-select-none": "user-select: none",

  // Position
  "chai-relative": "position: relative",
  "chai-absolute": "position: absolute",
  "chai-fixed": "position: fixed",

  // Opacity
  "chai-opacity-50": "opacity: 0.5",
  "chai-opacity-75": "opacity: 0.75",

  // Transition
  "chai-transition": "transition: all 0.2s ease",

  // Neobrutalist
  "chai-neo-shadow": "box-shadow: 5px 5px 0px #0a0a0a",
  "chai-neo-shadow-lg": "box-shadow: 7px 7px 0px #0a0a0a",
  "chai-neo-shadow-sm": "box-shadow: 3px 3px 0px #0a0a0a",
  "chai-border-neo": "border: 3px solid #0a0a0a",
  "chai-border-neo-thick": "border: 4px solid #0a0a0a",
  "chai-bg-cream": "background-color: #fdfaf2",
  "chai-bg-ink": "background-color: #0a0a0a",
  "chai-text-ink": "color: #0a0a0a",
  "chai-text-cream": "color: #fdfaf2",
  "chai-bg-neo-blue": "background-color: #60b5ff",
  "chai-bg-neo-orange": "background-color: #ff9149",
  "chai-mb-6": "margin-bottom: 24px",
};

function applyStyleString(el, styleStr) {
  styleStr.split(";").forEach((declaration) => {
    const colonIdx = declaration.indexOf(":");
    if (colonIdx === -1) return;

    const property = declaration.slice(0, colonIdx).trim();
    const value = declaration.slice(colonIdx + 1).trim();

    if (property && value) {
      el.style.setProperty(property, value);
    }
  });
}

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT"]);

function processElement(el) {
  if (el.nodeType !== Node.ELEMENT_NODE) return;
  if (SKIP_TAGS.has(el.tagName)) return;
  if (!el.classList || el.classList.length === 0) return;

  const matched = [];

  el.classList.forEach((cls) => {
    if (customStyles[cls]) {
      applyStyleString(el, customStyles[cls]);
      matched.push(cls);
    }
  });

  if (matched.length > 0) {
    el.setAttribute("data-chai-applied", matched.join(" "));

    if (ChaiWind.debug) {
      console.log(
        `%c[chai-wind]%c matched on <${el.tagName.toLowerCase()}>:`,
        "color: #f97316; font-weight: bold",
        "color: inherit",
        matched,
        "→ style applied:",
        el.getAttribute("style"),
      );
    }
  }
}

function scanDOM(root = document.body) {
  const elements = root.querySelectorAll('[class*="chai-"]');
  elements.forEach(processElement);
  processElement(root);
}

let _pendingNodes = new Set();
let _rafId = null;

function _flushPending() {
  _pendingNodes.forEach((node) => {
    processElement(node);
    node.querySelectorAll?.('[class*="chai-"]').forEach(processElement);
  });
  _pendingNodes.clear();
  _rafId = null;
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      _pendingNodes.add(node);
    });

    if (mutation.type === "attributes" && mutation.attributeName === "class") {
      _pendingNodes.add(mutation.target);
    }
  });

  if (!_rafId) {
    _rafId = requestAnimationFrame(_flushPending);
  }
});

const ChaiWind = {
  debug: false,

  init(options = {}) {
    if (options.debug !== undefined) this.debug = options.debug;

    if (options.styles) {
      Object.assign(customStyles, options.styles);
    }

    scanDOM();

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    console.log(
      `%c chai-wind initialized %c ${Object.keys(customStyles).length} classes registered`,
      "background: #f97316; color: white; font-weight: bold; padding: 2px 6px; border-radius: 3px",
      "color: #f97316",
    );
  },

  register(newStyles = {}) {
    Object.assign(customStyles, newStyles);
    Object.keys(newStyles).forEach((cls) => {
      document.querySelectorAll(`[class~="${cls}"]`).forEach(processElement);
    });
  },

  refresh() {
    scanDOM();
  },

  listClasses() {
    console.table(customStyles);
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ChaiWind;
} else if (typeof window !== "undefined") {
  window.ChaiWind = ChaiWind;
}
