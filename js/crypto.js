async function renderCrypto(){

const table=document.getElementById("cryptoTable")

if(!table) return

table.innerHTML=createEmptyRow(3,"Carregando criptomoedas...")

try{

const data=await fetchCryptoPrices()

const cryptos=[

{name:"Bitcoin",symbol:"BTC",price:data.bitcoin.usd},

{name:"Ethereum",symbol:"ETH",price:data.ethereum.usd},

{name:"Solana",symbol:"SOL",price:data.solana.usd},

{name:"BNB",symbol:"BNB",price:data.binancecoin.usd},

{name:"XRP",symbol:"XRP",price:data.ripple.usd}

]

const assetUrl=s=>`ativos/ativo.html?symbol=${s}`

table.innerHTML=cryptos.map(c=>`

<tr class="clickable-row" data-url="${assetUrl(c.symbol)}">

<td>
<a class="asset-link" href="${assetUrl(c.symbol)}">${c.name}</a>
</td>

<td>$${formatUsd(c.price)}</td>

<td>
<span class="status">
<span class="dot blue"></span>
Monitorando
</span>
</td>

</tr>

`).join("")

bindClickableRows()

}catch{

table.innerHTML=createEmptyRow(3,"Erro ao carregar criptomoedas")

}

}

document.addEventListener("DOMContentLoaded",()=>{

renderCrypto()

setInterval(renderCrypto,REFRESH_INTERVALS.crypto)

})
