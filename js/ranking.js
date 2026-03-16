async function renderRankingPage() {
  const gainersTable = document.getElementById("rankingGainersTable");
  const losersTable = document.getElementById("rankingLosersTable");
  const stocksTable = document.getElementById("rankingStocksTable");
  const cryptoTable = document.getElementById("rankingCryptoTable");

  const topGainer = document.getElementById("rankingTopGainer");
  const topLoser = document.getElementById("rankingTopLoser");
  const topCrypto = document.getElementById("rankingTopCrypto");

  if (!gainersTable || !losersTable || !stocksTable || !cryptoTable) return;

  gainersTable.innerHTML = createEmptyRow(3, "Carregando ranking...");
  losersTable.innerHTML = createEmptyRow(3, "Carregando ranking...");
  stocksTable.innerHTML = createEmptyRow(4, "Carregando ações...");
  cryptoTable.innerHTML = createEmptyRow(3, "Carregando criptomoedas...");

  try {
    const [stocksApi, cryptoApi] = await Promise.all([
      fetchStocks(),
      fetchCryptoPrices()
    ]);

    const stocks = stocksApi.map((stock) => {
      const percent = Number(stock.regularMarketChangePercent || 0);
      return {
        symbol: stock.symbol,
        price:
          typeof stock.regularMarketPrice === "number"
            ? stock.regularMarketPrice.toLocaleString("pt-BR")
            : "--",
        change: percent,
        changeText: `${percent >= 0 ? "+" : ""}${percent.toFixed(2)}%`,
        direction: percent >= 0 ? "Alta" : "Baixa"
      };
    });

    const cryptos = [
      { name: "Bitcoin", symbol: "BTC", price: cryptoApi?.bitcoin?.usd ?? null },
      { name: "Ethereum", symbol: "ETH", price: cryptoApi?.ethereum?.usd ?? null },
      { name: "Solana", symbol: "SOL", price: cryptoApi?.solana?.usd ?? null },
      { name: "BNB", symbol: "BNB", price: cryptoApi?.binancecoin?.usd ?? null },
      { name: "XRP", symbol: "XRP", price: cryptoApi?.ripple?.usd ?? null }
    ];

    const positiveStocks = [...stocks]
      .filter((item) => item.change >= 0)
      .sort((a, b) => b.change - a.change);

    const negativeStocks = [...stocks]
      .filter((item) => item.change < 0)
      .sort((a, b) => a.change - b.change);

    const stockUrl = (symbol) => `ativos/ativo.html?symbol=${symbol}`;

    const stockMainRows = (list) =>
      list
        .map(
          (item) => `
            <tr class="clickable-row" data-url="${stockUrl(item.symbol)}">
              <td><a class="asset-link" href="${stockUrl(item.symbol)}">${item.symbol}</a></td>
              <td>${item.price}</td>
              <td class="${getChangeClass(item.changeText)}">${item.changeText}</td>
              <td>
                <span class="status">
                  <span class="dot ${getDotClassByChange(item.changeText)}"></span>
                  ${item.direction}
                </span>
              </td>
            </tr>
          `
        )
        .join("");

    const stockMiniRows = (list) =>
      list
        .map(
          (item) => `
            <tr class="clickable-row" data-url="${stockUrl(item.symbol)}">
              <td><a class="asset-link" href="${stockUrl(item.symbol)}">${item.symbol}</a></td>
              <td>${item.price}</td>
              <td class="${getChangeClass(item.changeText)}">${item.changeText}</td>
            </tr>
          `
        )
        .join("");

    const cryptoRows = cryptos
      .map(
        (item) => `
          <tr class="clickable-row" data-url="${stockUrl(item.symbol)}">
            <td><a class="asset-link" href="${stockUrl(item.symbol)}">${item.name}</a></td>
            <td>$${formatUsd(item.price)}</td>
            <td>
              <span class="status">
                <span class="dot blue"></span>
                Monitorando
              </span>
            </td>
          </tr>
        `
      )
      .join("");

    gainersTable.innerHTML =
      positiveStocks.length > 0
        ? stockMiniRows(positiveStocks.slice(0, 5))
        : createEmptyRow(3, "Sem altas disponíveis.");

    losersTable.innerHTML =
      negativeStocks.length > 0
        ? stockMiniRows(negativeStocks.slice(0, 5))
        : createEmptyRow(3, "Sem quedas disponíveis.");

    stocksTable.innerHTML =
      stocks.length > 0
        ? stockMainRows(stocks)
        : createEmptyRow(4, "Sem ações disponíveis.");

    cryptoTable.innerHTML =
      cryptos.length > 0
        ? cryptoRows
        : createEmptyRow(3, "Sem criptomoedas disponíveis.");

    if (topGainer && positiveStocks[0]) topGainer.textContent = positiveStocks[0].symbol;
    if (topLoser && negativeStocks[0]) topLoser.textContent = negativeStocks[0].symbol;
    if (topCrypto && cryptos[0]) topCrypto.textContent = cryptos[0].symbol;

    bindClickableRows();
  } catch (error) {
    gainersTable.innerHTML = createEmptyRow(3, "Erro ao carregar ranking.");
    losersTable.innerHTML = createEmptyRow(3, "Erro ao carregar ranking.");
    stocksTable.innerHTML = createEmptyRow(4, "Erro ao carregar ações.");
    cryptoTable.innerHTML = createEmptyRow(3, "Erro ao carregar criptomoedas.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderRankingPage();
  setInterval(renderRankingPage, REFRESH_INTERVALS.stocks);
});
