async function loadStocks() {
  const data = await fetchAPI("stocks");

  const table = document.getElementById("stocksTable");

  table.innerHTML = data.map(s => `
    <tr>
      <td>${s.symbol}</td>
      <td>R$ ${s.price}</td>
      <td class="${s.change >= 0 ? 'positive' : 'negative'}">
        ${s.change}%
      </td>
    </tr>
  `).join("");
}

loadStocks();
setInterval(loadStocks, 60000);
