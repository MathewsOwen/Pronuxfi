// =========================
// API CRIPTO (CoinGecko)
// =========================

async function fetchCryptoPrices() {

const url =
"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple&vs_currencies=usd"

const res = await fetch(url)
return res.json()

}


// =========================
// API AÇÕES BRASILEIRAS
// =========================

async function fetchStocks() {

const url =
"https://brapi.dev/api/quote/PETR4,VALE3,ITUB4,WEGE3,BBAS3,BBDC4,MGLU3,ELET3"

const res = await fetch(url)
const data = await res.json()

return data.results

}


// =========================
// API NOTÍCIAS
// =========================

async function fetchMarketNews() {

const url =
"https://newsapi.org/v2/everything?q=mercado financeiro OR bolsa OR bitcoin&language=pt&sortBy=publishedAt&pageSize=10&apiKey=YOUR_API_KEY"

const res = await fetch(url)
const data = await res.json()

return data.articles

}
