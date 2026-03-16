const stocks=[
{symbol:"PETR4",price:"38.50"},
{symbol:"VALE3",price:"66.20"},
{symbol:"ITUB4",price:"31.90"},
{symbol:"WEGE3",price:"45.10"}
]

const table=document.getElementById("stocksTable")

if(table){
table.innerHTML=stocks.map(s=>`

<div class="marketRow">
${s.symbol} - ${s.price}
</div>
`).join("")
}

