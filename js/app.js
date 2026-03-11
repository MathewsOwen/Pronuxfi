window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        const content = document.getElementById('site-content');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            content.style.display = 'block';
            setTimeout(() => { 
                content.style.opacity = '1'; 
                renderDashboard();
            }, 50);
        }, 800);
    }, CONFIG.SPLASH_DELAY);
});

function renderDashboard() {
    new TradingView.widget({
        "container_id": "main-chart", "symbol": CONFIG.IBOV_SYMBOL,
        "interval": "D", "theme": "dark", "style": "3", "width": "100%", "height": "400px", "hide_top_toolbar": true
    });
    loadStockData();
    setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000);
}

async function loadStockData() {
    const response = await fetch(CONFIG.SHEET_URL);
    const data = await response.text();
    const rows = data.split('\n').slice(1);
    const sectors = {};

    rows.forEach(row => {
        const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if(cols[0]) {
            const stock = {
                ticker: cols[0].replace(/"/g,''),
                price: cols[2],
                pct: cols[3],
                sector: (cols[4] || "Outros").trim().replace(/"/g,'')
            };
            if(!sectors[stock.sector]) sectors[stock.sector] = [];
            sectors[stock.sector].push(stock);
        }
    });
    displaySectors(sectors);
}

function displaySectors(sectors) {
    const container = document.getElementById('sectors-container');
    for (const name in sectors) {
        const html = `
            <h2 class="sector-title">${name}</h2>
            <div class="stocks-grid">
                ${sectors[name].map(s => `
                    <div class="stock-card">
                        <div style="color:var(--accent); font-weight:800; font-size:12px">${s.ticker}</div>
                        <div style="font-size:24px; font-weight:700; margin:8px 0; font-family:'JetBrains Mono'">${s.price}</div>
                        <div style="color:${s.pct.includes('-')?'var(--down)':'var(--up)'}; font-weight:700">${s.pct}</div>
                    </div>
                `).join('')}
            </div>
        `;
        container.innerHTML += html;
    }
}
