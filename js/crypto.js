document.addEventListener("DOMContentLoaded", async () => {
  const cryptoTable = document.getElementById("cryptoTable");
  const homeCryptoTable = document.getElementById("homeCryptoTable");
  const cryptoWatchTable = document.getElementById("cryptoWatchTable");
  const cryptoTickerTrack = document.getElementById("cryptoTickerTrack");

  const statBtc = document.getElementById("statBtc");
  const btcMainStat = document.getElementById("btcMainStat");
  const ethMainStat = document.getElementById("ethMainStat");

  const loading = createEmptyRow(3, "Carregando dados de criptomoedas...");

  if (cryptoTable) cryptoTable.innerHTML = loading;
  if (homeCryptoTable) homeCryptoTable.innerHTML = loading;
  if (cryptoWatchTable) cryptoWatchTable.innerHTML = loading;

  try {
    const data = await fetchCryptoPrices();

    const cryptos = [
      { name: "Bitcoin", short: "BTC", price: data?.bitcoin?.usd, status: "Monitorando" },
      { name: "Ethereum", short: "ETH", price: data?.ethereum?.usd, status: "Monitorando" },
      { name: "Solana", short: "SOL", price: data?.solana?.usd, status: "Monitorando" },
      { name: "BNB", short: "BNB", price: data?.binancecoin?.usd, status: "Monitorando" },
      { name: "XRP", short: "XRP", price: data?.ripple?.usd, status: "Monitorando" }
    ];

    const renderRows = (list) =>
      list
        .map(
          (crypto) => `
          <tr>
            <td>${crypto.name}</td>
            <td>$${formatUsd(crypto.price)}</td>
            <td>
              <span class="status">
                <span class="dot blue"></span>
                ${crypto.status}
              </span>
            </td>
          </tr>
        `
        )
        .join("");

    if (cryptoTable) {
      cryptoTable.innerHTML = renderRows(cryptos);
    }

    if (homeCryptoTable) {
      homeCryptoTable.innerHTML = renderRows(cryptos.slice(0, 5));
    }

    if (cryptoWatchTable) {
      cryptoWatchTable.innerHTML = renderRows(cryptos);
    }

    if (cryptoTickerTrack) {
      const tickerItems = cryptos
        .map(
          (crypto) => `
          <span class="ticker-item">
            <strong>${crypto.short}</strong>
            <span>$${formatUsd(crypto.price)}</span>
            <span class="neutral">Monitorando</span>
          </span>
        `
        )
        .join("");

      cryptoTickerTrack.innerHTML = tickerItems + tickerItems;
    }

    if (statBtc && typeof data?.bitcoin?.usd === "number") {
      statBtc.textContent = `$${formatUsd(data.bitcoin.usd)}`;
    }

    if (btcMainStat && typeof data?.bitcoin?.usd === "number") {
      btcMainStat.textContent = `$${formatUsd(data.bitcoin.usd)}`;
    }

    if (ethMainStat && typeof data?.ethereum?.usd === "number") {
      ethMainStat.textContent = `$${formatUsd(data.ethereum.usd)}`;
    }
  } catch (error) {
    const fail = createEmptyRow(3, "Não foi possível carregar os dados agora.");

    if (cryptoTable) cryptoTable.innerHTML = fail;
    if (homeCryptoTable) homeCryptoTable.innerHTML = fail;
    if (cryptoWatchTable) cryptoWatchTable.innerHTML = fail;

    if (statBtc) statBtc.textContent = "Indisponível";
    if (btcMainStat) btcMainStat.textContent = "Indisponível";
    if (ethMainStat) ethMainStat.textContent = "Indisponível";
  }
});
