// ===============================
// HOME - PRONUXFIN
// ===============================
document.addEventListener('DOMContentLoaded', async () => {
  const overviewStrip = document.querySelector('#overview-strip');
  const homeStocks = document.querySelector('#home-stocks');
  const homeRanking = document.querySelector('#home-ranking');
  const homeNews = document.querySelector('#home-news');

  if (overviewStrip) {
    renderOverviewSkeleton(overviewStrip);
  }

  if (homeStocks) {
    setLoading(homeStocks, 'Carregando destaques da B3...');
  }

  if (homeRanking) {
    renderCardSkeletons(homeRanking, 3);
  }

  if (homeNews) {
    renderNewsSkeletons(homeNews, 3);
  }

  await Promise.allSettled([
    loadOverview(overviewStrip),
    loadHomeStocks(homeStocks),
    loadHomeRanking(homeRanking),
    loadHomeNews(homeNews)
  ]);
});

// ===============================
// HELPERS DE NORMALIZAÇÃO
// ===============================
function normalizeCollection(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  return [];
}

function safeNumber(value, fallback = 0) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return fallback;
  }

  const normalized = value
    .trim()
    .replace(/\.(?=\d{3}(\D|$))/g, '')
    .replace(',', '.')
    .replace(/[^\d.-]/g, '');

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// ===============================
// VISÃO GERAL DO MERCADO
// ===============================
async function loadOverview(container) {
  if (!container || !window.api) {
    return;
  }

  try {
    const response = await window.api.getOverview();
    const items = normalizeCollection(response);

    if (!items.length) {
      setEmpty(container, 'Nenhum dado disponível para visão geral.');
      return;
    }

    container.innerHTML = items
      .slice(0, 4)
      .map((item) => {
        const name = item.name || item.symbol || 'Ativo';
        const price = item.price ?? item.value ?? item.points ?? 0;
        const changePercent = item.changePercent ?? item.variation ?? item.change ?? 0;

        return `
          <div class="quote-item">
            <h4>${escapeHTML(name)}</h4>
            <div class="value">${formatSmartValue(price)}</div>
            <p class="delta ${getDeltaClass(safeNumber(changePercent))}">
              ${formatPercent(safeNumber(changePercent))}
            </p>
          </div>
        `;
      })
      .join('');
  } catch (error) {
    console.error('[HOME OVERVIEW ERROR]', error);
    setError(container, 'Não foi possível carregar a visão geral do mercado.');
  }
}

// ===============================
// DESTAQUES DA B3
// ===============================
async function loadHomeStocks(container) {
  if (!container || !window.api) {
    return;
  }

  try {
    setLoading(container, 'Carregando destaques da B3...');

    const response = await window.api.getStocks();
    const rows = normalizeCollection(response);

    if (!rows.length) {
      setEmpty(container, 'Nenhum destaque da B3 disponível no momento.');
      return;
    }

    renderTable(
      container,
      [
        {
          label: 'Ticker',
          key: 'symbol',
          render: (row) => createAssetRowLink(row.symbol || '--', 'stock')
        },
        {
          label: 'Nome',
          key: 'name',
          render: (row) => escapeHTML(row.name || '--')
        },
        {
          label: 'Preço',
          key: 'price',
          render: (row) =>
            formatCurrency(
              safeNumber(row.price ?? row.close ?? row.regularMarketPrice ?? 0),
              'BRL'
            )
        },
        {
          label: 'Variação',
          key: 'changePercent',
          render: (row) =>
            formatDeltaHTML(
              safeNumber(
                row.changePercent ??
                row.variation ??
                row.regularMarketChangePercent ??
                0
              )
            )
        }
      ],
      rows.slice(0, 6)
    );
  } catch (error) {
    console.error('[HOME STOCKS ERROR]', error);
    setError(container, 'Não foi possível carregar os destaques da B3.');
  }
}

// ===============================
// RANKING DA HOME
// ===============================
async function loadHomeRanking(container) {
  if (!container || !window.api) {
    return;
  }

  try {
    const response = await window.api.getRanking(6);
    const items = normalizeCollection(response);

    if (!items.length) {
      setEmpty(container, 'Nenhum ranking disponível no momento.');
      return;
    }

    container.innerHTML = items
      .slice(0, 6)
      .map((item, index) => {
        const symbol = item.symbol || '--';
        const type = item.type || 'stock';
        const name = item.name || 'Ativo monitorado';
        const changePercent = safeNumber(
          item.changePercent ?? item.variation ?? item.change ?? 0
        );

        return `
          <div class="asset-list-item">
            <small>Posição ${index + 1}</small>
            <strong>${createAssetRowLink(symbol, type)}</strong>
            <span class="card-subtitle">
              ${escapeHTML(name)} •
              <span class="delta ${getDeltaClass(changePercent)}">
                ${formatPercent(changePercent)}
              </span>
            </span>
          </div>
        `;
      })
      .join('');
  } catch (error) {
    console.error('[HOME RANKING ERROR]', error);
    setError(container, 'Falha ao carregar ranking.');
  }
}

// ===============================
// NOTÍCIAS DA HOME
// ===============================
async function loadHomeNews(container) {
  if (!container || !window.api) {
    return;
  }

  try {
    const response = await window.api.getNews(6);
    const items = normalizeCollection(response);

    if (!items.length) {
      setEmpty(container, 'Nenhuma notícia disponível no momento.');
      return;
    }

    container.innerHTML = items
      .slice(0, 6)
      .map((item) => createNewsItem(item))
      .join('');
  } catch (error) {
    console.error('[HOME NEWS ERROR]', error);
    setError(container, 'Não foi possível carregar as notícias.');
  }
}

// ===============================
// SKELETONS PREMIUM
// ===============================
function renderOverviewSkeleton(container) {
  container.innerHTML = Array.from({ length: 4 })
    .map(
      () => `
        <div class="quote-item skeleton-card">
          <div class="skeleton skeleton-line skeleton-title"></div>
          <div class="skeleton skeleton-line skeleton-value"></div>
          <div class="skeleton skeleton-line skeleton-delta"></div>
        </div>
      `
    )
    .join('');
}

function renderCardSkeletons(container, total = 3) {
  container.innerHTML = Array.from({ length: total })
    .map(
      () => `
        <div class="asset-list-item skeleton-card">
          <div class="skeleton skeleton-line skeleton-mini"></div>
          <div class="skeleton skeleton-line skeleton-value"></div>
          <div class="skeleton skeleton-line"></div>
        </div>
      `
    )
    .join('');
}

function renderNewsSkeletons(container, total = 3) {
  container.innerHTML = Array.from({ length: total })
    .map(
      () => `
        <div class="news-card skeleton-card">
          <div class="skeleton skeleton-line skeleton-title"></div>
          <div class="skeleton skeleton-line"></div>
          <div class="skeleton skeleton-line skeleton-mini"></div>
        </div>
      `
    )
    .join('');
}
