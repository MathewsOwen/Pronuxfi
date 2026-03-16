const stocks = [
    {s: "PETR4", p: 38.50, c: 1.2}, {s: "VALE3", p: 66.20, c: -0.5},
    {s: "ITUB4", p: 31.90, c: 0.8}, {s: "MGLU3", p: 2.15, c: -3.2}
];
const grid = document.getElementById("stocksGrid");
if(grid) grid.innerHTML = stocks.map(s => `
    <div class="row-item">
        <div><b>${s.s}</b><br><small>B3</small></div>
        <div style="text-align:right">R$ ${s.p.toFixed(2)}<br><span class="${s.c>=0?'up':'down'}">${s.c}%</span></div>
    </div>`).join('');
