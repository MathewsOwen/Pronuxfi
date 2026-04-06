const API_CONFIG = {
  baseURL: window.PRONUXFIN_API_BASE || 'http://localhost:3000/api'
};

async function request(path, options = {}) {
  const url = `${API_CONFIG.baseURL}${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    if (!response.ok) {
      const message = `Erro ${response.status} ao acessar ${path}`;
      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    console.error('[Pronuxfin API]', error);
    throw error;
  }
}

const api = {
  search: (query) => request(`/search?q=${encodeURIComponent(query)}`),
  getOverview: () => request('/markets/overview'),
  getStocks: (symbols = 'PETR4,VALE3,ITUB4,BBAS3,WEGE3') => request(`/stocks/quote?symbols=${encodeURIComponent(symbols)}`),
  getStocksList: (page = 1, limit = 20) => request(`/stocks/list?page=${page}&limit=${limit}`),
  getCryptos: (limit = 20) => request(`/crypto/markets?limit=${limit}`),
  getGlobalMarkets: () => request('/markets/global'),
  getNews: (limit = 12) => request(`/news/latest?limit=${limit}`),
  getRanking: (limit = 20) => request(`/ranking/assets?limit=${limit}`),
  getHeatmap: () => request('/heatmap/b3'),
  getRadar: () => request('/radar/events'),
  getCalendar: (country = 'BR', limit = 12) => request(`/calendar/economic?country=${encodeURIComponent(country)}&limit=${limit}`),
  getAssetDetails: (symbol, type = 'stock') => request(`/asset/${encodeURIComponent(symbol)}?type=${encodeURIComponent(type)}`)
};
