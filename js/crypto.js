async function loadCrypto() {
  const data = await fetchAPI("crypto");

  const table = document.getElementById("cryptoTable");

  table.innerHTML = data.map(c => `
    <tr>
      <td>${c.name}</td>
      <td>$ ${c.price}</td>
      <td class="${c.change >= 0 ? 'positive' : 'negative'}">
        ${c.change}%
      </td>
    </tr>
  `).join("");
}

loadCrypto();
setInterval(loadCrypto, 60000);
