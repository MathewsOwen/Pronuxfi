// ===============================
// CONFIGURAÇÃO DA API
// ===============================
const API_CONFIG = {
  baseURL: (
    window.PRONUXFIN_API_BASE ||
    (window.location.hostname.includes('github.io')
      ? 'https://SEU-BACKEND.onrender.com/api'
      : 'http://localhost:3000/api')
  ).replace(/\/+$/, ''),
  timeout: 10000
};

// ===============================
// FUNÇÃO BASE DE REQUEST
// ===============================
async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_CONFIG.baseURL}${normalizedPath}`;

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro ${response.status}: ${text}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error('[API TIMEOUT]', url);
      throw new Error('Tempo de resposta excedido.');
    }

    console.error('[API ERROR]', url, error);
    throw error;
  }
}

// ===============================
// ENDPOINTS CENTRALIZADOS
// ===============================
const api = {
  search(query) {
    return request(`/search?q=${encodeURIComponent(query)}`);
  },

  getOverview() {
    return request('/markets/overview');
  },

  getStocks(symbols = 'PETR4,VALE3,ITUB4,BBAS3,WEGE3') {
    return request(`/stocks/quote?symbols=${encodeURIComponent(symbols)}`);
  },

  getStocksList(page = 1, limit = 20) {
    return request(`/stocks/list?page=${page}&limit=${limit}`);
  },

  getCryptos(limit = 20) {
    return request(`/crypto/markets?limit=${limit}`);
  },

  getGlobalMarkets() {
    return request('/markets/global');
  },

  getNews(limit = 12) {
    return request(`/news/latest?limit=${limit}`);
  },

  getRanking(limit = 20) {
    return request(`/ranking/assets?limit=${limit}`);
  },

  getHeatmap() {
    return request('/heatmap/b3');
  },

  getRadar() {
    return request('/radar/events');
  },

  getCalendar(country = 'BR', limit = 20) {
    return request(`/calendar/economic?country=${encodeURIComponent(country)}&limit=${limit}`);
  },

  getAssetDetails(symbol, type = 'stock') {
    return request(`/asset/${encodeURIComponent(symbol)}?type=${encodeURIComponent(type)}`);
  }
};

// ===============================
// DISPONIBILIZA GLOBALMENTE
// ===============================
window.api = api;
window.API_CONFIG = API_CONFIG;
