```markdown
# MarketStack Insight (`marketstack-insight-20250629_033649`)

## Project Description

[Read the Detailed Docs here.](https://docs.google.com/document/d/1STB-NxHzHPb8IoQSkqDPXVSltXl3ZRSAvvOqpzhwDcA/)

**MarketStack Insight** is a Chrome extension designed for analysts, marketers, and business teams seeking quick, actionable web intelligence directly within their workflow. With a single click, users can analyze the technology stack, business details, SEO/traffic data, and competitor landscape of any website they visit?then build, organize, and export lead lists, or directly integrate enriched data with external CRMs.

The extension features a modular dashboard UI, advanced data enrichment, batch export/integration capabilities, robust settings, and a secure, efficient architecture based on Chrome Extension Manifest V3.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture & Component Map](#architecture--component-map)
- [Installation](#installation)
- [Usage](#usage)
- [Component Details](#component-details)
- [Dependencies](#dependencies)
- [Development Notes](#development-notes)
- [License](#license)

---

## Overview

MarketStack Insight lets you:

- Instantly detect and analyze website technologies, SEO, and business information while browsing.
- Organize, filter, and export prospect/lead lists.
- Access a modular dashboard with rich widgets and multi-section navigation.
- Integrate web-sourced data directly with third-party CRMs.
- Set up scheduled monitoring, notifications, and sync your preferences across Chrome installations.

### Who Should Use This?

- Growth, marketing, or sales teams building target lists and gathering competitive intelligence.
- Analysts seeking quick access to firmographics and tech stacks of prospects.
- Anyone needing site-level insights, lead list management, or CRM export without leaving the browser tab.

---

## Features

- **One-Click Technology & Asset Analysis**: Scan any site and unveil its tech stack, SEO/traffic profile, company info, contacts, and competitors.
- **Interactive Dashboard UI**: Modular summary widgets for quick analysis across multiple data domains.
- **Multi-Tab Navigation**: Seamless UI for viewing tech, SEO, company, contacts, competitors, leads, and settings.
- **Lead/Prospect List Builder**: Save, categorize, filter, and batch-export leads. Import lists, build segments, or push to CRM.
- **CSV/Excel Export**: Downloadable prospect lists and analysis reports.
- **CRM Integration**: Sync lead data into external CRMs with authentication and secure data flow.
- **Rule-Based Alerts & Monitoring**: Get notified of significant changes or new matches.
- **User Preferences & Enterprise-Ready Authentication**: Customizable settings, premium/enterprise auth.
- **Accessibility and Responsive UI**: High-contrast, keyboard-friendly, and scalable layouts.

---

## Architecture & Component Map

The extension is built around a modular, MVC-inspired architecture split into the following layers:

```
[UI: popup.html/popup.js, dashboardwidgets.js] 
      ? (Chrome messaging)
[Content Script: contentscantech.js]                  
      ?
[Background: backgroundmanager.js]       
      ?              
[API Services: apitechdetection.js, apiseodata.js, apienrichcompanyinfo.js]
      ?
[Data Storage & Utility: chrome.storage, utilsdatacache.js, storageleadlists.js, storageusersettings.js]
      ?
[Exports & Integrations: exportcsvexcel.js, integrationcrm.js]
      ?
[Security & Messaging: permissionshandler.js, authhandler.js, utilsmessaging.js]
```

All inter-component communication uses Chrome?s runtime messaging and/or synchronized storage to maintain statelessness and user security.

---

## Installation

**From Chrome Web Store** (when available):

1. Open [Chrome Web Store](https://chrome.google.com/webstore).
2. Search for "MarketStack Insight".
3. Click **Add to Chrome**.

**Manual/Development Installation:**

1. Clone or download this repository.
2. Open Chrome and navigate to: `chrome://extensions`
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select the project directory.
5. The extension icon should appear in your Chrome toolbar.

---

## Usage

1. **Browse to any website.**
2. **Click the MarketStack Insight icon** in your Chrome toolbar.
3. The dashboard popup will open and start scanning the current site.
4. **Explore these tabs**:
    - **Tech Stack:** Detected frontend/backend/platform tech.
    - **SEO/Traffic:** Rankings, traffic stats, keywords.
    - **Company:** Firmographics, contacts, socials.
    - **Competitors:** Related or similar sites.
    - **Leads:** Review and manage saved lead entries.
    - **Settings:** Configure integrations, preferences, alerts.
5. **Build a Lead List** by saving sites; batch export your list via CSV/Excel, or connect/sync to your CRM.
6. (Optional) **Configure scheduled monitoring or custom alerts** in the Settings tab.

### Example Screenshots

> _(Add images of the extension in use, popups, and dashboard views here, if available.)_

---

## Component Details

Below is a breakdown of each core file/module and its role:

| Component                    | Type        | Status   | Purpose / Notes                                                                                                                      | Key Dependencies         |
|------------------------------|-------------|----------|-------------------------------------------------------------------------------------------------------------------------------------|-------------------------|
| **backgroundmanager.js**     | JS          | Pass     | Background orchestration: scan requests, API enrichment, alert scheduling, cache, Chrome messaging.                                 | utilsmessaging.js       |
| **contentscantech.js**       | JS          | Pass     | Content script: DOM analysis, tech detection, sends results to background.                                                          | utilsmessaging.js       |
| **dashboardwidgets.js**      | JS          | Pass     | Modular UI dashboard cards for tech, SEO, company, competitors.                                                                    | popup.js                |
| **leadlistmanager.js**       | JS          | Pending  | Manages lead/prospect list UI and logic, filtering, saving, exporting.                                                             | storageleadlists.js     |
| **exportcsvexcel.js**        | JS          | Pending  | Converts lead lists into downloadable CSV/Excel files.                                                                              | --                      |
| **integrationcrm.js**        | JS          | Pending  | API connectors to 3rd-party CRMs; syncs/pushes data in batch.                                                                     | authhandler.js          |
| **apitechdetection.js**      | JS          | Pending  | Calls external APIs for deeper tech stack enrichment.                                                                               | utilsdatacache.js       |
| **apiseodata.js**            | JS          | Pending  | SEO, traffic, and domain ranking API client.                                                                                        | utilsdatacache.js       |
| **apienrichcompanyinfo.js**  | JS          | Pending  | Calls business data APIs (LinkedIn, WHOIS, etc).                                                                                   | authhandler.js          |
| **utilsmessaging.js**        | JS          | Pending  | Wraps Chrome messaging layer for robust cross-module events.                                                                        | --                      |
| **popup.html/popup.js**      | HTML / JS   | Pending  | Main extension popup/Dashboard. Tab navigation, data rendering, event flow.                                                        | dashboardwidgets.js     |
| **popup.css**                | CSS         | Pending  | Styles for popup UI: responsive, accessible, high-contrast.                                                                         | --                      |
| **dashboardwidgets.css**     | CSS         | Pending  | Card/widget-specific dashboard styling.                                                                                             | --                      |
| **options.html/options.js**  | HTML / JS   | Pending  | Options/settings page for preferences, integrations, filter rules.                                                                  | storageusersettings.js  |
| **storageleadlists.js**      | JS          | Pending  | Chrome storage abstraction for saved prospect/lead lists.                                                                           | --                      |
| **storageusersettings.js**   | JS          | Pending  | Chrome storage for user-specific settings (filters, integrations, UI).                                                              | --                      |
| **utilsdatacache.js**        | JS          | Pending  | Local/Persistent cache for API results to optimize enrichment calls.                                                                | --                      |
| **permissionshandler.js**    | JS          | Pending  | Handles Chrome extension permissions: request/check/revoke with feedback.                                                           | --                      |
| **authhandler.js**           | JS          | Pending  | Manages authentication flows/tokens for premium/data APIs/CRM.                                                                      | --                      |
| **manifest.json**            | JSON        | Pending  | Chrome Extension Manifest V3 spec and configuration.                                                                                | --                      |

### *UI/Menu/Accessibility Notes*
- All UI and logic files are modularized for testability and maintainability.
- *popup.css* and *dashboardwidgets.css* aim for AA/AAA accessibility.
- If dashboardwidgets.js does not implement full tabbed navigation, consider enhancing for completeness.
- Advanced UI (notifications, modals, badge icons) may be iteratively added.

---

## Dependencies

- **Chrome Extension APIs**: Uses Manifest V3 for service worker/event-page logic, storage, messaging, permissions.
- **External APIs**: For richer tech detection, SEO/traffic enrichment, company info (requires appropriate API keys/tokens in options).
- **No front-end frameworks**: Vanilla JavaScript, HTML, and CSS for performance and portability.
- **[chrome.storage.sync**](https://developer.chrome.com/docs/extensions/reference/storage/#property-sync): Sync user data and settings across instances.

_In development mode_:  
No build steps are required as of now; all assets are loaded directly.

---

## Development Notes

- **Project is organized for easy extensibility and testing.**  
  Each major function is isolated in its own module (see [Component Details](#component-details)).
- **Security built in.**  
  All sensitive actions (API calls, authentication, permissions) are strictly handled and reviewed.
- **Accessibility prioritized.**
- *If you?re customizing UI*, review and potentially extend navigation logic (tabs/sidebars/modals) in `dashboardwidgets.js` and the associated CSS.
- **PRs, bug reports, and feature requests welcome!**

---

## License

_(Add your license here, e.g., MIT, Apache 2.0, or proprietary.)_

---

#### For more details, refer to [the full project requirements and architecture spec.](https://docs.google.com/document/d/1STB-NxHzHPb8IoQSkqDPXVSltXl3ZRSAvvOqpzhwDcA/)
```
