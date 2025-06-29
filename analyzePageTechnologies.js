function foundInDom(pattern, _cachedOuterHTML) {
  if (!pattern) return false;

  // Efficient outerHTML caching
  let outerHTML = _cachedOuterHTML;
  if (!outerHTML) outerHTML = document.documentElement.outerHTML;

  // String: Check in HTML
  if (typeof pattern === 'string') {
    return outerHTML.includes(pattern);
  }

  // Regex: Check in HTML
  if (pattern instanceof RegExp) {
    return pattern.test(outerHTML);
  }

  // Object: attribute, scriptSrc, linkHref, meta, etc.
  if (typeof pattern === 'object' && pattern !== null) {
    // Attribute on any element: { attribute: "data-reactroot" }
    if (pattern.attribute) {
      const els = document.querySelectorAll('[' + pattern.attribute + ']');
      if (els.length > 0) return true;
    }
    // Inline script code: { scriptRegex: /window.__NEXT_DATA__/ }
    if (pattern.scriptRegex) {
      const scripts = Array.from(document.scripts);
      for (const s of scripts) {
        if (s.textContent && pattern.scriptRegex.test(s.textContent)) return true;
      }
    }
    // External script src: { scriptSrc: /cdn\.segment\.com/ }
    if (pattern.scriptSrc) {
      const scripts = Array.from(document.scripts);
      for (const s of scripts) {
        if (s.src && pattern.scriptSrc.test(s.src)) return true;
      }
    }
    // External stylesheet href: { linkHref: /fonts\.googleapis\.com/ }
    if (pattern.linkHref) {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      for (const l of links) {
        if (l.href && pattern.linkHref.test(l.href)) return true;
      }
    }
    // Meta tag: { metaName: "generator", content: /WordPress/ }
    if (pattern.metaName && pattern.content) {
      const metas = Array.from(document.querySelectorAll(`meta[name="${pattern.metaName}"]`));
      for (const m of metas) {
        if (m.content && pattern.content.test(m.content)) return true;
      }
    }
  }

  return false;
}

// --- MESSAGING FUNCTION ---
function sendMessageToBackground(message) {
  if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage(message);
  }
}

// --- MAIN ANALYSIS IIFE ---
(function analyzePageTechnologies() {
  // Defensive: use window-scoped variable
  const techSignatures = typeof dataTechSignatures !== 'undefined'
    ? dataTechSignatures
    : (window.dataTechSignatures || []);

  const detected = {};
  // Cache outerHTML ONCE for performance (see review)
  let cachedOuterHTML;
  try {
    cachedOuterHTML = document.documentElement.outerHTML;
  } catch (e) {
    cachedOuterHTML = '';
  }

  for (const sig of techSignatures) {
    try {
      if (foundInDom(sig.pattern, cachedOuterHTML)) {
        detected[sig.name] = true;
      }
    } catch (e) {
      // Log error for signature debug while scanning, include signature name for triage
      console.error('Error analyzing signature', sig && sig.name, e);
    }
  }

  sendMessageToBackground({
    type: 'DOM_SCAN_RESULT',
    data: detected,
    url: window.location.href,
  });
})();