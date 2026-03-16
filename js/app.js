const REFRESH_INTERVALS = {

  markets: 60000,
  stocks: 60000,
  crypto: 60000,
  news: 300000

};

/* =======================
UTILS
======================= */

function formatUsd(value){

if(typeof value !== "number") return "--"

return value.toLocaleString("en-US")

}

function getChangeClass(change){

if(String(change).startsWith("+")) return "positive"

if(String(change).startsWith("-")) return "negative"

return "neutral"

}

function getDotClassByChange(change){

if(String(change).startsWith("+")) return "green"

if(String(change).startsWith("-")) return "red"

return "blue"

}

function createEmptyRow(colspan,message){

return `
<tr>
<td colspan="${colspan}" class="empty-state">${message}</td>
</tr>
`

}

/* =======================
CLICKABLE ROWS
======================= */

function bindClickableRows(){

document.querySelectorAll("tr.clickable-row").forEach(row=>{

row.addEventListener("click",e=>{

if(e.target.tagName==="A") return

const url=row.dataset.url

if(url) window.location.href=url

})

})

}

/* =======================
TRADINGVIEW CHART
======================= */

function createAdvancedChart(containerId,symbol){

if(typeof TradingView==="undefined") return

new TradingView.widget({

autosize:true,

symbol:symbol,

interval:"D",

timezone:"America/Sao_Paulo",

theme:"dark",

style:"1",

locale:"br",

container_id:containerId

})

}
