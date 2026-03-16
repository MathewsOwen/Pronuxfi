document.addEventListener("DOMContentLoaded", () => {
  const stocksTable = document.getElementById("stocksTable");
  if (!stocksTable) return;

  const stocks = [
    { ticker: "PETR4", price: "38,50", change: "+1,82%", direction: "Alta" },
    { ticker: "VALE3", price: "66,20", change: "-0,95%", direction: "Baixa" },
    { ticker: "ITUB4", price: "31,90", change: "+0,74%", direction: "Alta" },
    { ticker: "WEGE3", price: "45,10", change: "+1,10%", direction: "Alta" },
    { ticker: "BBAS3", price: "28,44", change: "-0,38%", direction: "Baixa" }
  ];

  stocksTable.innerHTML = stocks
    .map((stock) => {
      const isPositive = stock.change.startsWith("+");
      const statusClass = isPositive ? "green" : "red";
      const changeClass = isPositive ? "positive" : "negative";

      return `
        <tr>
          <td>${stock.ticker}</td>
          <td>${stock.price}</td>
          <td class="${changeClass}">${stock.change}</td>
          <td>
            <span class="status">
              <span class="dot ${statusClass}"></span>
              ${stock.direction}
            </span>
          </td>
        </tr>
      `;
    })
    .join("");
});
