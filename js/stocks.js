let stocksRenderInProgress = false;

async function renderStocks() {
  if (stocksRenderInProgress) return;
  stocksRenderInProgress = true;

  const stocksTable = document.getElementById("stocksTable");
  const homeStocksTable = document.getElementById("homeStocksTable");
  const topGainersTable = document.getElementById("topGainersTable");
  const topLosersTable = document.getElementById("topLosersTable");
  const topGainerStat = document.getElementById("topGainerStat");
  const topLoserStat = document.getElementById("topLoserStat");
  const stocksTickerTrack = document.getElementById("stocksTickerTrack");

  try {
    const apiStocks = await fetchStocks();
    const assetBase = getAssetPageBase();

    const stocks = apiStocks
      .filter((stock) => stock && stock.symbol)
      .map((stock) => {
        const percent = Number(stock.regularMarketChangePercent ?? 0);
        const rawPrice = Number(stock.regularMarketPrice);

        return {
          ticker: String(stock.symbol).toUpperCase(),
          price: Number.isFinite(rawPrice)
            ? rawPrice.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            : "--",
          changeValue: Number.isFinite(percent) ? percent : 0,
          change: `${percent >= 0 ? "+" : ""}${(Number.isFinite(percent) ? percent : 0).toFixed(2)}%`,
          direction: percent > 0 ? "Alta" : percent < 0 ? "Baixa" : "Neutro"
        };
      })
      .sort((a, b) => a.ticker.localeCompare(b.ticker, "pt-BR"));

    const assetUrl = (ticker) =>
      `${assetBase}?symbol=${encodeURIComponent(ticker)}`;

    const renderMainRows = (list) =>
      list
        .map(
          (stock) => `
            <tr class="clickable-row" data-url="${assetUrl(stock.ticker)}">
              <td>
                <a class="asset-link" href="${assetUrl(stock.ticker)}">${escapeHtml(stock.ticker)}</a>
              </td>
              <td>${stock.price}</td>
              <td class="${getChangeClass(stock.change)}">${stock.change}</td>
              <td>
                <span class="status">
                  <span class="dot ${getDotClassByChange(stock.change)}"></span>
                  ${stock.direction}
                </span>
              </td>
            </tr>
          `
        )
        .join("");

    const renderMiniRows = (list) =>
      list
        .map(
          (stock) => `
            <tr class="clickable-row" data-url="${assetUrl(stock.ticker)}">
              <td>
                <a class="asset-link" href="${assetUrl(stock.ticker)}">${escapeHtml(stock.ticker)}</a>
              </td>
              <td>${stock.price}</td>
              <td class="${getChangeClass(stock.change)}">${stock.change}</td>
            </tr>
          `
        )
        .join("");

    const positiveStocks = [...stocks]
      .filter((item) => item.changeValue > 0)
      .sort((a, b) => b.changeValue - a.changeValue);

    const negativeStocks = [...stocks]
      .filter((item) => item.changeValue < 0)
      .sort((a, b) => a.changeValue - b.changeValue);

    if (stocksTable) {
      stocksTable.innerHTML =
        stocks.length > 0
          ? renderMainRows(stocks)
          : createEmptyRow(4, "Nenhuma ação disponível.");
    }

    if (homeStocksTable) {
      homeStocksTable.innerHTML =
        stocks.length > 0
          ? renderMainRows(stocks.slice(0, 4))
          : createEmptyRow(4, "Nenhuma ação disponível.");
    }

    if (topGainersTable) {
      topGainersTable.innerHTML =
        positiveStocks.length > 0
          ? renderMiniRows(positiveStocks.slice(0, 4))
          : createEmptyRow(3, "Sem altas no momento.");
    }

    if (topLosersTable) {
      topLosersTable.innerHTML =
        negativeStocks.length > 0
          ? renderMiniRows(negativeStocks.slice(0, 4))
          : createEmptyRow(3, "Sem quedas no momento.");
    }

    if (topGainerStat) {
      topGainerStat.textContent =
        positiveStocks.length > 0 ? positiveStocks[0].ticker : "--";
    }

    if (topLoserStat) {
      topLoserStat.textContent =
        negativeStocks.length > 0 ? negativeStocks[0].ticker : "--";
    }

    if (stocksTickerTrack) {
      if (stocks.length > 0) {
        const tickerItems = stocks
          .map(
            (stock) => `
              <span class="ticker-item">
                <strong>${escapeHtml(stock.ticker)}</strong>
                <span>${stock.price}</span>
                <span class="${getChangeClass(stock.change)}">${stock.change}</span>
              </span>
            `
          )
          .join("");

        stocksTickerTrack.innerHTML = tickerItems + tickerItems;
      } else {
        stocksTickerTrack.innerHTML = `
          <span class="ticker-item">
            <strong>Ações</strong>
            <span>Sem dados no momento</span>
          </span>
        `;
      }
    }

    bindClickableRows();
  } catch (error) {
    if (stocksTable) {
      stocksTable.innerHTML = createEmptyRow(
        4,
        "Não foi possível carregar os dados das ações."
      );
    }

    if (homeStocksTable) {
      homeStocksTable.innerHTML = createEmptyRow(
        4,
        "Não foi possível carregar os dados das ações."
      );
    }

    if (topGainersTable) {
      topGainersTable.innerHTML = createEmptyRow(3, "Erro ao carregar.");
    }

    if (topLosersTable) {
      topLosersTable.innerHTML = createEmptyRow(3, "Erro ao carregar.");
    }

    if (topGainerStat) topGainerStat.textContent = "--";
    if (topLoserStat) topLoserStat.textContent = "--";

    if (stocksTickerTrack) {
      stocksTickerTrack.innerHTML = `
        <span class="ticker-item">
          <strong>Ações</strong>
          <span>Falha na atualização</span>
        </span>
      `;
    }

    console.error("[Pronuxfin] Erro em renderStocks:", error);
  } finally {
    stocksRenderInProgress = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderStocks();

  setInterval(() => {
    renderStocks();
  }, REFRESH_INTERVALS.stocks);
});
