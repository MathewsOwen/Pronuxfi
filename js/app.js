const REFRESH_INTERVALS = {
  markets: 60_000,
  stocks: 60_000,
  crypto: 60_000,
  news: 300_000
};

const SEARCH_ASSETS = [
  { symbol: "PETR4", name: "Petrobras PN", type: "Ação" },
  { symbol: "VALE3", name: "Vale ON", type: "Ação" },
  { symbol: "ITUB4", name: "Itaú Unibanco PN", type: "Ação" },
  { symbol: "MGLU3", name: "Magazine Luiza ON", type: "Ação" },
  { symbol: "BTC", name: "Bitcoin", type: "Cripto" },
  { symbol: "ETH", name: "Ethereum", type: "Cripto" },
  { symbol: "SOL", name: "Solana", type: "Cripto" },
  { symbol: "BNB", name: "BNB", type: "Cripto" },
  { symbol: "XRP", name: "XRP", type: "Cripto" }
];

function isInsideAtivosFolder() {
  return window.location.pathname.split("/").includes("ativos");
}

function getAssetPageBase() {
  return isInsideAtivosFolder() ? "../ativos/ativo.html" : "ativos/ativo.html";
}

function normalizeChangeValue(change) {
  if (typeof change === "number") {
    if (change > 0) return "+";
    if (change < 0) return "-";
    return "0";
  }

  const value = String(change ?? "").trim();

  if (value.startsWith("+")) return "+";
  if (value.startsWith("-")) return "-";

  const numeric = Number(value.replace(",", ".").replace("%", ""));
  if (!Number.isNaN(numeric)) {
    if (numeric > 0) return "+";
    if (numeric < 0) return "-";
  }

  return "0";
}

function getChangeClass(change) {
  const signal = normalizeChangeValue(change);
  if (signal === "+") return "positive";
  if (signal === "-") return "negative";
  return "neutral";
}

function getDotClassByChange(change) {
  const signal = normalizeChangeValue(change);
  if (signal === "+") return "green";
  if (signal === "-") return "red";
  return "blue";
}

function createEmptyRow(colspan, message) {
  return `
    <tr>
      <td colspan="${colspan}" class="empty-state">${message}</td>
    </tr>
  `;
}

function formatUsd(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "--";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value >= 100 ? 2 : 2,
    maximumFractionDigits: value >= 100 ? 2 : 4
  }).format(value);
}

function safeSetText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createAdvancedChart(containerId, symbol) {
  if (typeof TradingView === "undefined") {
    console.warn("[Pronuxfin] TradingView não está disponível.");
    return;
  }

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  try {
    new TradingView.widget({
      autosize: true,
      symbol,
      interval: "D",
      timezone: "America/Sao_Paulo",
      theme: "dark",
      style: "1",
      locale: "br",
      toolbar_bg: "#0f172a",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      container_id: containerId
    });
  } catch (error) {
    console.error("[Pronuxfin] Erro ao renderizar gráfico TradingView:", error);
    container.innerHTML = `
      <div class="empty-state">
        Não foi possível carregar o gráfico no momento.
      </div>
    `;
  }
}

function bindClickableRows(scope = document) {
  scope.querySelectorAll("tr.clickable-row").forEach((row) => {
    if (row.dataset.bound === "true") return;
    row.dataset.bound = "true";

    row.addEventListener("click", (event) => {
      const interactiveElement = event.target.closest(
        "a, button, input, select, textarea, label"
      );
      if (interactiveElement) return;

      const url = row.getAttribute("data-url");
      if (url) {
        window.location.href = url;
      }
    });
  });
}

function setupGlobalSearch() {
  const input = document.getElementById("globalSearch");
  const results = document.getElementById("searchResults");

  if (!input || !results) return;

  const assetBase = getAssetPageBase();

  function hideResults() {
    results.innerHTML = "";
    results.classList.remove("show");
  }

  function showResults() {
    results.classList.add("show");
  }

  function renderResults(items) {
    if (!items.length) {
      results.innerHTML = `
        <div class="search-result-item">
          <span class="search-result-symbol">Nenhum ativo encontrado</span>
          <span class="search-result-meta">Tente buscar por PETR4, VALE3, BTC, ETH...</span>
        </div>
      `;
      showResults();
      return;
    }

    results.innerHTML = items
      .map((item) => {
        const symbol = escapeHtml(item.symbol);
        const name = escapeHtml(item.name);
        const type = escapeHtml(item.type);

        return `
          <a class="search-result-item" href="${assetBase}?symbol=${encodeURIComponent(item.symbol)}">
            <span class="search-result-symbol">${symbol}</span>
            <span class="search-result-meta">${name} • ${type}</span>
          </a>
        `;
      })
      .join("");

    showResults();
  }

  function getFilteredAssets(term) {
    const normalizedTerm = term.trim().toUpperCase();

    if (!normalizedTerm) return [];

    return SEARCH_ASSETS.filter((item) => {
      const symbol = item.symbol.toUpperCase();
      const name = item.name.toUpperCase();
      const type = item.type.toUpperCase();

      return (
        symbol.includes(normalizedTerm) ||
        name.includes(normalizedTerm) ||
        type.includes(normalizedTerm)
      );
    }).slice(0, 6);
  }

  input.addEventListener("input", () => {
    const term = input.value.trim();

    if (!term) {
      hideResults();
      return;
    }

    const filtered = getFilteredAssets(term);
    renderResults(filtered);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideResults();
      input.blur();
      return;
    }

    if (event.key === "Enter") {
      const term = input.value.trim().toUpperCase();
      if (!term) return;

      const exactMatch = SEARCH_ASSETS.find(
        (item) =>
          item.symbol.toUpperCase() === term ||
          item.name.toUpperCase() === term
      );

      if (exactMatch) {
        window.location.href = `${assetBase}?symbol=${encodeURIComponent(exactMatch.symbol)}`;
        return;
      }

      const filtered = getFilteredAssets(term);
      if (filtered.length) {
        window.location.href = `${assetBase}?symbol=${encodeURIComponent(filtered[0].symbol)}`;
      }
    }
  });

  input.addEventListener("focus", () => {
    const term = input.value.trim();
    if (!term) return;

    const filtered = getFilteredAssets(term);
    renderResults(filtered);
  });

  document.addEventListener("click", (event) => {
    if (!results.contains(event.target) && event.target !== input) {
      results.classList.remove("show");
    }
  });
}

function initializeGlobalFeatures() {
  if (document.getElementById("tradingview_chart")) {
    createAdvancedChart("tradingview_chart", "BMFBOVESPA:IBOV");
  }

  setupGlobalSearch();
  bindClickableRows();
}

document.addEventListener("DOMContentLoaded", initializeGlobalFeatures);
