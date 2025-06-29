const MESSAGE_TYPES = {
  SCAN_SITE_REQUEST: 'SCAN_SITE_REQUEST',
  DOM_SCAN_RESULT: 'DOM_SCAN_RESULT',
  SCAN_DATA: 'SCAN_DATA',
  SCAN_ERROR: 'SCAN_ERROR',
  // Additional types as needed
};

const cache = Object.create(null);

// Helper: send message to popup with flexible type/status
function sendToPopup(payload, type = MESSAGE_TYPES.SCAN_DATA) {
  chrome.runtime.sendMessage({ type, data: payload });
}

// Helper: trigger scan in content-script for tab
function triggerDomScanInTab(tabId = null) {
  if (tabId) {
    chrome.tabs.sendMessage(tabId, { type: 'TRIGGER_DOM_SCAN' });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'TRIGGER_DOM_SCAN' });
      }
    });
  }
}

// Helper: resolve tech stack from DOM scan result
async function resolveTechStack(domData) {
  // Replace with robust detection logic or external API call if needed
  // Return e.g. [{name: 'React', version: '18.2.0'}]
  return detectTechnologiesFromDom(domData);
}

// Helper: fetch/enrich company info
async function enrichCompanyInfo(url) {
  // Lookup domain, call 3rd party/company api, etc.
  // Return e.g. {name: 'Example Inc', industry: 'SaaS', ...}
  return fetchCompanyProfile(url);
}

// Helper: fetch SEO & traffic data
async function fetchSeoTrafficData(url) {
  // Call external API or local estimator
  // Return e.g. {monthlyVisits: 50000, domainRating: 68, ...}
  return getSeoMetrics(url);
}

// Helper: cache API results (memory & chrome.storage)
function cacheApiResults(url, result) {
  cache[url] = result;
  chrome.storage.local.set({ [`scanResult:${url}`]: result });
}

// Helper: check cache (sync to memory first)
function getCachedResults(url) {
  return cache[url];
}

// Helper: Restore cache from chrome.storage.local at startup
function restoreCacheFromStorage() {
  chrome.storage.local.get(null, (items) => {
    Object.keys(items).forEach(key => {
      if (key.startsWith('scanResult:')) {
        const url = key.slice('scanResult:'.length);
        cache[url] = items[key];
      }
    });
  });
}

// Try to rehydrate memory cache on service worker startup/reload
restoreCacheFromStorage();

// Listen for incoming messages
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  try {
    switch (msg.type) {
      case MESSAGE_TYPES.SCAN_SITE_REQUEST: {
        triggerDomScanInTab(sender.tab ? sender.tab.id : null);
        break;
      }
      case MESSAGE_TYPES.DOM_SCAN_RESULT: {
        const url = msg.url;
        if (!url) break;

        // Check persistent/memory cache
        const cached = getCachedResults(url);
        if (cached) {
          sendToPopup(cached, MESSAGE_TYPES.SCAN_DATA);
          break;
        }

        // Async orchestration
        let techs = null, company = null, seo = null;
        try {
          [techs, company, seo] = await Promise.all([
            resolveTechStack(msg.data),
            enrichCompanyInfo(url),
            fetchSeoTrafficData(url),
          ]);
          const result = { techs, company, seo };
          cacheApiResults(url, result);
          sendToPopup(result, MESSAGE_TYPES.SCAN_DATA);
        } catch (error) {
          // Log error, send error to UI
          const errorPayload = {
            message: 'Failed to complete scan enrichment',
            error: (error && error.message) ? error.message : String(error),
            url,
          };
          sendToPopup(errorPayload, MESSAGE_TYPES.SCAN_ERROR);
        }
        break;
      }
      // Additional message handling as needed
      // case MESSAGE_TYPES.ALERT: ...
      // case MESSAGE_TYPES.ADD_TO_SAVED_LIST: ...
      default:
        break;
    }
  } catch (err) {
    // Comprehensive error report to UI
    const errorPayload = {
      message: 'Background error',
      error: (err && err.message) ? err.message : String(err),
      context: msg && msg.type,
    };
    sendToPopup(errorPayload, MESSAGE_TYPES.SCAN_ERROR);
  }
  // Enable async sendResponse (even if not used, for Chrome Messaging protocol)
  return true;
});

// Example tech stack detector (stub)
function detectTechnologiesFromDom(domData) {
  // ...implementation...
  return [];
}

// Example company info lookup (stub)
function fetchCompanyProfile(url) {
  // ...implementation...
  return {};
}

// Example SEO metric fetcher (stub)
function getSeoMetrics(url) {
  // ...implementation...
  return {};
}