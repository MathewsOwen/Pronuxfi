document.addEventListener("DOMContentLoaded", () => {
  const stocksTable = document.getElementById("stocksTable");
  const homeStocksTable = document.getElementById("homeStocksTable");
  const topGainersTable = document.getElementById("topGainersTable");
  const topLosersTable = document.getElementById("topLosersTable");
  const topGainerStat = document.getElementById("topGainerStat");
  const topLoserStat = document.getElementById("topLoserStat");
  const stocksTickerTrack = document.getElementById("stocksTickerTrack");

  const stocks = [
    { ticker: "PETR4", price: "38,50", change: "+1,82%", direction: "Alta" },
    { ticker: "VALE3", price: "66,20", change: "-0,95%", direction: "Baixa" },
    { ticker: "ITUB4", price: "31,90", change: "+0,74%", direction: "Alta" },
    { ticker: "WEGE3", price: "45,10", change: "+1,10%", direction: "Alta" },
    { ticker: "BBAS3", price: "28,44", change: "-0,38%", direction: "Baixa" },
    { ticker: "BBDC4", price: "14,82", change: "+0,28%", direction: "Alta" },
    { ticker: "MGLU3", price: "12,30", change: "+2,14%", direction: "Alta" },
    { ticker: "ELET3", price: "40,22", change: "-0,42%", direction: "Baixa" }
  ];

  const renderMainRows = (list) =>
    list
      .map((stock) => `
        <tr>
          <td>${stock.ticker}</td>
          <td>${stock.price}</td>
          <td class="${getChangeClass(stock.change)}">${stock.change}</td>
          <td>
            <span class="status">
              <span class="dot ${getDotClassByChange(stock.change)}"></span>
              ${stock.direction}
            </span>
          </td>
        </tr>
      `)
      .join("");

  const renderMiniRows = (list) =>
    list
      .map((stock) => `
        <tr>
          <td>${stock.ticker}</td>
          <td>${stock.price}</td>
          <td class="${getChangeClass(stock.change)}">${stock.change}</td>
        </tr>
      `)
      .join("");

  const positiveStocks = stocks.filter((item) => item.change.startsWith("+"));
  const negativeStocks = stocks.filter((item) => item.change.startsWith("-"));

  positiveStocks.sort((a, b) => parseFloat(b.change.replace("%", "").replace(",", ".")) - parseFloat(a.change.replace("%", "").replace(",", ".")));
  negativeStocks.sort((a, b) => parseFloat(a.change.replace("%", "").replace(",", ".")) - parseFloat(b.change.replace("%", "").replace(",", ".")));

  if (stocksTable) {
    stocksTable.innerHTML = renderMainRows(stocks);
  }

  if (homeStocksTable) {
    homeStocksTable.innerHTML = renderMainRows(stocks.slice(0, 5));
  }

  if (topGainersTable) {
    topGainersTable.innerHTML = renderMiniRows(positiveStocks.slice(0, 4));
  }

  if (topLosersTable) {
    topLosersTable.innerHTML = renderMiniRows(negativeStocks.slice(0, 4));
  }

  if (topGainerStat && positiveStocks.length > 0) {
    topGainerStat.textContent = positiveStocks[0].ticker;
  }

  if (topLoserStat && negativeStocks.length > 0) {
    topLoserStat.textContent = negativeStocks[0].ticker;
  }

  if (stocksTickerTrack) {
    const tickerItems = stocks
      .map((stock) => `
        <span class="ticker-item">
          <strong>${stock.ticker}</strong>
          <span>${stock.price}</span>
          <span class="${getChangeClass(stock.change)}">${stock.change}</span>
        </span>
      `)
      .join("");

    stocksTickerTrack.innerHTML = tickerItems + tickerItems;
  }
});
