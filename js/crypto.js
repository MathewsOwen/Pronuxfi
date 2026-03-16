async function loadCripto() {
    const grid = document.getElementById("cryptoGrid");
    if(!grid) return;
    const data = await PronuxAPI.getCripto();
    if(data) {
        const items = [{n:"Bitcoin",s:"BTC",d:data.bitcoin},{n:"Ethereum",s:"ETH",d:data.ethereum}];
        grid.innerHTML = items.map(i => `
            <div class="row-item">
                <div><b>${i.n}</b><br><small>${i.s}</small></div>
                <div style="text-align:right">$${i.d.usd.toLocaleString()}<br><span class="${i.d.usd_24h_change>=0?'up':'down'}">${i.d.usd_24h_change.toFixed(2)}%</span></div>
            </div>`).join('');
    }
}
loadCripto();
