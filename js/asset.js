// ===============================
// ATIVO - PRONUXFIN
// ===============================

document.addEventListener('DOMContentLoaded', () => {
  if (!window.api) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const symbol = params.get('symbol');
  const type = params.get('type') || 'stock';

  if (!symbol) {
    renderAssetError('Ativo não informado na URL.');
    return;
  }

  loadAssetPage(symbol, type);
});

// ===============================
// CARREGAR PÁGINA DO ATIVO
// ===============================
async function loadAssetPage(symbol, type) {
  const titleEl = document.querySelector('#asset-title');
  const subtitleEl = document.querySelector('#asset-subtitle');
  const kpisEl = document.querySelector('#asset-kpis');
  const summaryEl = document.querySelector('#asset-summary');
  const detailsTableEl = document.querySelector('#asset-details-table');
  const chartEl = document.querySelector('#asset-chart');

  try {
    const response = await window.api.getAssetDetails(symbol, type);
    const asset = response.item || response.data || response || {};

    const name = asset.name || symbol;
    const category = asset.category || (type === 'crypto' ? 'Criptomoeda' : 'Ação');
    const currency = asset.currency || (type === 'crypto' ? 'USD' : 'BRL');

    if (titleEl) {
      titleEl.textContent = `${symbol} — ${name}`;
    }

    if (subtitleEl) {
      subtitleEl.textContent = `${category} acompanhada em tempo real com visão estratégica da Pronuxfin.`;
    }

    renderAssetKpis(kpisEl, asset, currency);
    renderAssetSummary(summaryEl, asset, symbol, category);
    renderAssetDetailsTable(detailsTableEl, asset, currency);
    renderAssetChart(chartEl, symbol, type);

    document.title = `${symbol} | Pronuxfin`;
  } catch (error) {
    console.error('[ASSET ERROR]', error);
    renderAssetError('Não foi possível carregar os detalhes do ativo.');
  }
}

// ===============================
// KPIS
// ===============================
function renderAssetKpis(container, asset, currency) {
  if (!container) {
    return;
  }

  const price = formatCurrency(asset.price, currency);
  const change = formatPercent(asset.changePercent);
  const volume = formatCompact(asset.volume);
  const marketCap = formatCompact(asset.marketCap);

  container.innerHTML = `
    <div class="stat-card">
      <span class="stat-label">Preço</span>
      <strong class="stat-value">${price}</strong>
      <small class="stat-subtitle">${asset.updatedAt || asset.lastUpdate || 'Atualização recente'}</small>
    </div>

    <div class="stat-card">
      <span class="stat-label">Variação</span>
      <strong class="stat-value delta ${getDeltaClass(asset.changePercent)}">${change}</strong>
      <small class="stat-subtitle">Última variação registrada</small>
    </div>

    <div class="stat-card">
      <span class="stat-label">Volume</span>
      <strong class="stat-value">${volume}</strong>
      <small class="stat-subtitle">Liquidez do ativo</small>
    </div>

    <div class="stat-card">
      <span class="stat-label">Market Cap</span>
      <strong class="stat-value">${marketCap}</strong>
      <small class="stat-subtitle">Valor de mercado</small>
    </div>
  `;
}

// ===============================
// RESUMO
// ===============================
function renderAssetSummary(container, asset, symbol, category) {
  if (!container) {
    return;
  }

  const summaryItems = [
    { label: 'Ticker', value: symbol },
    { label: 'Nome', value: asset.name || '--' },
    { label: 'Categoria', value: category || '--' },
    { label: 'Setor', value: asset.sector || asset.segment || '--' },
    { label: 'País', value: asset.country || '--' },
    { label: 'Moeda', value: asset.currency || '--' }
  ];

  container.innerHTML = summaryItems
    .map((item) => {
      return `
        <div class="summary-row">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
        </div>
      `;
    })
    .join('');
}

// ===============================
// TABELA DE INDICADORES
// ===============================
function renderAssetDetailsTable(container, asset, currency) {
  if (!container) {
    return;
  }

  const rows = [
    {
      indicator: 'Preço atual',
      value: formatCurrency(asset.price, currency)
    },
    {
      indicator: 'Variação percentual',
      value: `<span class="delta ${getDeltaClass(asset.changePercent)}">${formatPercent(asset.changePercent)}</span>`
    },
    {
      indicator: 'Abertura',
      value: asset.open !== undefined ? formatCurrency(asset.open, currency) : '--'
    },
    {
      indicator: 'Máxima',
      value: asset.high !== undefined ? formatCurrency(asset.high, currency) : '--'
    },
    {
      indicator: 'Mínima',
      value: asset.low !== undefined ? formatCurrency(asset.low, currency) : '--'
    },
    {
      indicator: 'Fechamento anterior',
      value: asset.previousClose !== undefined ? formatCurrency(asset.previousClose, currency) : '--'
    },
    {
      indicator: 'Volume',
      value: asset.volume !== undefined ? formatCompact(asset.volume) : '--'
    },
    {
      indicator: 'Market Cap',
      value: asset.marketCap !== undefined ? formatCompact(asset.marketCap) : '--'
    },
    {
      indicator: 'P/L',
      value: asset.peRatio !== undefined ? formatNumber(asset.peRatio, { maximumFractionDigits: 2 }) : '--'
    },
    {
      indicator: 'Dividend Yield',
      value: asset.dividendYield !== undefined ? `${formatNumber(asset.dividendYield, { maximumFractionDigits: 2 })}%` : '--'
    }
  ];

  renderTable(
    container,
    [
      {
        label: 'Indicador',
        key: 'indicator',
        render: (row) => row.indicator
      },
      {
        label: 'Valor',
        key: 'value',
        render: (row) => row.value
      }
    ],
    rows
  );
}

// ===============================
// GRÁFICO
// ===============================
function renderAssetChart(container, symbol, type) {
  if (!container) {
    return;
  }

  const marketSymbol = buildTradingViewSymbol(symbol, type);

  container.innerHTML = `
    <iframe
      src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${encodeURIComponent(marketSymbol)}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=0f1c2f&studies=[]&theme=dark&style=1&timezone=America%2FSao_Paulo&withdateranges=1&hidevolume=0&allow_symbol_change=1"
      width="100%"
      height="460"
      frameborder="0"
      allowtransparency="true"
      scrolling="no"
      class="tv-frame"
      title="Gráfico do ativo"
    ></iframe>
  `;
}

function buildTradingViewSymbol(symbol, type) {
  const normalized = String(symbol || '').toUpperCase().trim();

  if (type === 'crypto') {
    if (normalized.includes('USDT')) {
      return `BINANCE:${normalized}`;
    }

    if (normalized === 'BTC') return 'BINANCE:BTCUSDT';
    if (normalized === 'ETH') return 'BINANCE:ETHUSDT';
    if (normalized === 'SOL') return 'BINANCE:SOLUSDT';
    if (normalized === 'BNB') return 'BINANCE:BNBUSDT';

    return `BINANCE:${normalized}USDT`;
  }

  return `BMFBOVESPA:${normalized}`;
}

// ===============================
// ERRO GERAL
// ===============================
function renderAssetError(message) {
  const titleEl = document.querySelector('#asset-title');
  const subtitleEl = document.querySelector('#asset-subtitle');
  const kpisEl = document.querySelector('#asset-kpis');
  const summaryEl = document.querySelector('#asset-summary');
  const detailsTableEl = document.querySelector('#asset-details-table');
  const chartEl = document.querySelector('#asset-chart');

  if (titleEl) {
    titleEl.textContent = 'Ativo não disponível';
  }

  if (subtitleEl) {
    subtitleEl.textContent = message;
  }

  if (kpisEl) {
    kpisEl.innerHTML = `<div class="error">${message}</div>`;
  }

  if (summaryEl) {
    summaryEl.innerHTML = `<div class="error">${message}</div>`;
  }

  if (detailsTableEl) {
    detailsTableEl.innerHTML = `<div class="error">${message}</div>`;
  }

  if (chartEl) {
    chartEl.innerHTML = `<div class="error">${message}</div>`;
  }
}
