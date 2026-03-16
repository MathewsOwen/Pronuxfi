function renderMarkets(){

const table=document.getElementById("marketTable")

if(!table) return

const markets=[

{symbol:"IBOV",price:"128.450",change:"+0.84%"},

{symbol:"S&P500",price:"5210",change:"+0.42%"},

{symbol:"NASDAQ",price:"18200",change:"+0.67%"},

{symbol:"USD/BRL",price:"5.02",change:"-0.11%"}

]

table.innerHTML=markets.map(m=>`

<tr>

<td>${m.symbol}</td>

<td>${m.price}</td>

<td class="${getChangeClass(m.change)}">${m.change}</td>

</tr>

`).join("")

}

document.addEventListener("DOMContentLoaded",()=>{

renderMarkets()

setInterval(renderMarkets,REFRESH_INTERVALS.markets)

})
