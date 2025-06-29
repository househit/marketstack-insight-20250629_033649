function renderTechStack({ tech, onEvent, container }) {
  container.innerHTML = `
    <h3>Tech Stack</h3>
    <ul>
      ${
        Object.entries(tech).length
          ? Object.entries(tech)
              .map(
                ([category, technologies]) =>
                  `<li><strong>${category}:</strong> ${technologies.join(', ')}</li>`
              )
              .join('')
          : '<li>No technology data available.</li>'
      }
    </ul>
  `;
  // (Optional) Attach events if needed
  // Example: container.addEventListener('click', e => onEvent('techStackCardClick', e));
}

// Internal helper: Render Company Info Card
function renderCompanyInfo({ company, onEvent, container }) {
  container.innerHTML = `
    <h3>Company Info</h3>
    <ul>
      ${
        Object.entries(company).length
          ? Object.entries(company)
              .map(
                ([key, value]) =>
                  `<li><strong>${key}:</strong> ${value || 'N/A'}</li>`
              )
              .join('')
          : '<li>No company info available.</li>'
      }
    </ul>
  `;
}

// Internal helper: Render SEO/Traffic Card
function renderSeoTraffic({ seo, onEvent, container }) {
  container.innerHTML = `
    <h3>SEO &amp; Traffic</h3>
    <ul>
      ${
        Object.entries(seo).length
          ? Object.entries(seo)
              .map(
                ([key, value]) =>
                  `<li><strong>${key}:</strong> ${value || 'N/A'}</li>`
              )
              .join('')
          : '<li>No SEO or traffic data available.</li>'
      }
    </ul>
  `;
}

// Internal helper: Render Competitors Card
function renderCompetitors({ compareData, onEvent, container }) {
  container.innerHTML = `
    <h3>Competitors</h3>
    <ul>
      ${
        Array.isArray(compareData) && compareData.length
          ? compareData
              .map(
                (competitor) =>
                  `<li>${typeof competitor === 'string' ? competitor : competitor.name || JSON.stringify(competitor)}</li>`
              )
              .join('')
          : '<li>No competitors found.</li>'
      }
    </ul>
  `;
}

// Export ONLY the single public API function
export function renderSummaryCards({
  techStack = {},
  companyInfo = {},
  seoTraffic = {},
  competitors = [],
  containerId = 'summary-cards-root',
  onEvent = () => {},
}) {
  const root = document.getElementById(containerId);
  if (!root) return;

  root.innerHTML = '';

  // Tech Stack Card
  const techStackCard = document.createElement('div');
  techStackCard.className = 'widget-card widget-tech-stack';
  renderTechStack({
    tech: techStack,
    onEvent,
    container: techStackCard,
  });
  root.appendChild(techStackCard);

  // Company Info Card
  const companyInfoCard = document.createElement('div');
  companyInfoCard.className = 'widget-card widget-company-info';
  renderCompanyInfo({
    company: companyInfo,
    onEvent,
    container: companyInfoCard,
  });
  root.appendChild(companyInfoCard);

  // SEO & Traffic Card
  const seoTrafficCard = document.createElement('div');
  seoTrafficCard.className = 'widget-card widget-seo-traffic';
  renderSeoTraffic({
    seo: seoTraffic,
    onEvent,
    container: seoTrafficCard,
  });
  root.appendChild(seoTrafficCard);

  // Competitors Card
  const competitorsCard = document.createElement('div');
  competitorsCard.className = 'widget-card widget-competitors';
  renderCompetitors({
    compareData: competitors,
    onEvent,
    container: competitorsCard,
  });
  root.appendChild(competitorsCard);
}