const REFRESH_INTERVALS = {
  markets: 60_000,
  stocks: 60_000,
  crypto: 60_000,
  news: 300_000
};

function getChangeClass(change) {
  if (String(change).startsWith("+")) return "positive";
  if (String(change).startsWith("-")) return "negative";
  return "neutral";
}

function getDotClassByChange(change) {
  if (String(change).startsWith("+")) return "green";
  if (String(change).startsWith("-")) return "red";
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
  if (typeof value !== "number") return "--";
  return value.toLocaleString("en-US");
}

function safeSetText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function createAdvancedChart(containerId, symbol) {
  if (typeof TradingView === "undefined") return;
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

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
}

function bindClickableRows() {
  document.querySelectorAll("tr.clickable-row").forEach((row) => {
    if (row.dataset.bound === "true") return;
    row.dataset.bound = "true";

    row.addEventListener("click", (event) => {
      if (event.target.tagName.toLowerCase() === "a") return;
      const url = row.getAttribute("data-url");
      if (url) window.location.href = url;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tradingview_chart")) {
    createAdvancedChart("tradingview_chart", "BMFBOVESPA:IBOV");
  }
});
