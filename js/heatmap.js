document.addEventListener("DOMContentLoaded", () => {
  const heatmapGrid = document.getElementById("heatmapGrid");
  const topGainer = document.getElementById("heatmapTopGainer");
  const topLoser = document.getElementById("heatmapTopLoser");

  if (!heatmapGrid) return;

  const assetBase = getAssetPageBase();

  const assets = [
    { symbol: "PETR4", name: "Petrobras", change: 1.82, size: "large" },
    { symbol: "VALE3", name: "Vale", change: -0.95, size: "large" },
    { symbol: "ITUB4", name: "Itaú Unibanco", change: 0.74, size: "medium" },
    { symbol: "MGLU3", name: "Magazine Luiza", change: 2.14, size: "medium" },
    { symbol: "BTC", name: "Bitcoin", change: 1.26, size: "medium" },
    { symbol: "ETH", name: "Ethereum", change: -0.38, size: "medium" },
    { symbol: "SOL", name: "Solana", change: 2.42, size: "small" },
    { symbol: "BNB", name: "BNB", change: 0.19, size: "small" },
    { symbol: "XRP", name: "XRP", change: -0.61, size: "small" }
  ];

  if (!Array.isArray(assets) || assets.length === 0) {
    heatmapGrid.innerHTML = `
      <div class="card">
        <span class="card-label">HEATMAP</span>
        <h3>Sem dados disponíveis</h3>
        <p>Não foi possível montar o mapa de calor no momento.</p>
      </div>
    `;

    if (topGainer) topGainer.textContent = "--";
    if (topLoser) topLoser.textContent = "--";
    return;
  }

  const sortedPositive = [...assets].sort((a, b) => b.change - a.change);
  const sortedNegative = [...assets].sort((a, b) => a.change - b.change);

  if (topGainer) {
    topGainer.textContent = sortedPositive.length ? sortedPositive[0].symbol : "--";
  }

  if (topLoser) {
    topLoser.textContent = sortedNegative.length ? sortedNegative[0].symbol : "--";
  }

  function getHeatColor(change) {
    if (change >= 2) return "heat-strong-green";
    if (change > 0) return "heat-green";
    if (change <= -1) return "heat-strong-red";
    return "heat-red";
  }

  function getAssetUrl(symbol) {
    return `${assetBase}?symbol=${encodeURIComponent(symbol)}`;
  }

  heatmapGrid.innerHTML = assets
    .map((asset) => {
      const symbol = escapeHtml(asset.symbol);
      const name = escapeHtml(asset.name);
      const size = escapeHtml(asset.size);
      const change = Number(asset.change) || 0;
      const changeText = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;

      return `
        <a
          href="${getAssetUrl(asset.symbol)}"
          class="heatmap-card ${size} ${getHeatColor(change)}"
          aria-label="Abrir página do ativo ${symbol}"
        >
          <span class="heatmap-symbol">${symbol}</span>
          <span class="heatmap-name">${name}</span>
          <span class="heatmap-change">${changeText}</span>
        </a>
      `;
    })
    .join("");
});
