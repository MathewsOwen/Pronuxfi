async function renderNews(){

const feed=document.getElementById("newsFeed")

if(!feed) return

feed.innerHTML="<p>Carregando notícias...</p>"

try{

const data=await fetchMarketNews()

const articles=data.articles||[]

feed.innerHTML=articles.map(n=>`

<article class="news-item-advanced">

<h3>${n.title}</h3>

<p>${n.description||""}</p>

<a href="${n.url}" target="_blank">Ler notícia</a>

</article>

`).join("")

}catch{

feed.innerHTML="<p>Não foi possível carregar notícias</p>"

}

}

document.addEventListener("DOMContentLoaded",()=>{

renderNews()

setInterval(renderNews,REFRESH_INTERVALS.news)

})
