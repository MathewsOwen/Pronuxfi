// news.js
const news = [
    {time: "10:45", title: "FED mantém taxas, mercado reage positivamente"},
    {time: "09:30", title: "ETF de Ethereum recebe novo fluxo de 200M"}
];
const newsContainer = document.getElementById('newsFeed');
if(newsContainer) newsContainer.innerHTML = news.map(n => `
    <div class="news-card"><small>${n.time}</small><h3>${n.title}</h3></div>
`).join('');
