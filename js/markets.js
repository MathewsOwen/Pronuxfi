document.addEventListener("DOMContentLoaded", () => {
  const marketTable = document.getElementById("marketTable");
  if (!marketTable) return;

  const markets = [
    { symbol: "IBOVESPA", price: "128.450", change: "+0,84%", direction: "Alta" },
    { symbol: "S&P 500", price: "5.210", change: "+0,42%", direction: "Alta" },
    { symbol: "NASDAQ", price: "18.200", change: "+0,67%", direction: "Alta" },
    { symbol: "USD/BRL", price: "5,02", change: "-0,11%", direction: "Baixa" },
    { symbol: "OURO", price: "2.150", change: "+0,23%", direction: "Alta" }
  ];

  marketTable.innerHTML = markets
    .map((item) => {
      const isPositive = item.change.startsWith("+");
      const statusClass = isPositive ? "green" : "red";
      const changeClass = isPositive ? "positive" : "negative";

      return `
        <tr>
          <td>${item.symbol}</td>
          <td>${item.price}</td>
          <td class="${changeClass}">${item.change}</td>
          <td>
            <span class="status">
              <span class="dot ${statusClass}"></span>
              ${item.direction}
            </span>
          </td>
        </tr>
      `;
    })
    .join("");
});
