async function render() {
    const grid = document.getElementById('dataGrid');
    if(!grid) return;
    const data = await PronuxData.getMarket();
    grid.innerHTML = data.map(i => `
        <div class="t-row">
            <span><b>${i.id}</b>/USDT</span>
            <span>$ ${i.p.toLocaleString()}</span>
            <span class="${i.c >= 0 ? 'up':'down'}">${i.c}%</span>
            <span class="dim">${i.cap}</span>
            <button class="btn-trade">TRADE</button>
        </div>
    `).join('');
}
render();
