const markets = [
{symbol:"IBOV",price:"128.000"},
{symbol:"S&P 500",price:"5200"},
{symbol:"NASDAQ",price:"18000"},
{symbol:"DÓLAR",price:"5.02"}
]

const table=document.getElementById("marketTable")

if(table){
table.innerHTML=markets.map(m=>`

<div class="marketRow">
${m.symbol} - ${m.price}
</div>
`).join("")
}

