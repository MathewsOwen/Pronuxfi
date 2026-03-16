const news=[
"Mercado reage a decisão do FED",
"Bitcoin sobe após entrada institucional",
"Bolsa brasileira fecha em alta",
"Investidores atentos ao cenário global"
]

const feed=document.getElementById("newsFeed")

if(feed){
feed.innerHTML=news.map(n=>`

<div class="marketRow">
${n}
</div>
`).join("")
}

