document.addEventListener("DOMContentLoaded", async () => {

const cryptoTable = document.getElementById("cryptoTable")

if (!cryptoTable) return

try {

const data = await fetchCryptoPrices()

const cryptos = [

{ name: "Bitcoin", price: data.bitcoin.usd },

{ name: "Ethereum", price: data.ethereum.usd },

{ name: "Solana", price: data.solana.usd },

{ name: "BNB", price: data.binancecoin.usd },

{ name: "XRP", price: data.ripple.usd }

]

cryptoTable.innerHTML = cryptos.map(c => `

<tr>

<td>${c.name}</td>

<td>$${c.price}</td>

<td>

<span class="status">

<span class="dot blue"></span>

Monitorando

</span>

</td>

</tr>

`).join("")

} catch {

cryptoTable.innerHTML = `<tr><td colspan="3">Erro ao carregar dados</td></tr>`

}

})
