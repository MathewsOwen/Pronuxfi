document.addEventListener("DOMContentLoaded", () => {
  const marketTable = document.getElementById("marketTable");
  const tickerTrack = document.getElementById("tickerTrack");
  const heroStats = {
    ibov: document.getElementById("statIbov"),
    usd: document.getElementById("statUsd"),
    sp500: document.getElementById("statSp500")
  };

  const markets = [
    { symbol: "IBOVESPA", price: "128.450", change: "+0,84%", direction: "Alta" },
    { symbol: "S&P 500", price: "5.210", change: "+0,42%", direction: "Alta" },
    { symbol: "NASDAQ", price: "18.200", change: "+0,67%", direction: "Alta" },
    { symbol: "USD/BRL", price: "5,02", change: "-0,11%", direction: "Baixa" },
    { symbol: "OURO", price: "2.150", change: "+0,23%", direction: "Alta" },
    { symbol: "PETRÓLEO", price: "78,40", change: "+0,31%", direction: "Alta" }
  ];

  if (marketTable) {
    marketTable.innerHTML = markets
      .map((item) => `
        <tr>
          <td>${item.symbol}</td>
          <td>${item.price}</td>
          <td class="${getChangeClass(item.change)}">${item.change}</td>
          <td>
            <span class="status">
              <span class="dot ${getDotClassByChange(item.change)}"></span>
              ${item.direction}
            </span>
          </td>
        </tr>
      `)
      .join("");
  }

  if (tickerTrack) {
    const tickerItems = markets
      .map((item) => `
        <span class="ticker-item">
          <strong>${item.symbol}</strong>
          <span>${item.price}</span>
          <span class="${getChangeClass(item.change)}">${item.change}</span>
        </span>
      `)
      .join("");

    tickerTrack.innerHTML = tickerItems + tickerItems;
  }

  if (heroStats.ibov) heroStats.ibov.textContent = "128.450";
  if (heroStats.usd) heroStats.usd.textContent = "5,02";
  if (heroStats.sp500) heroStats.sp500.textContent = "5.210";
});
