window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('splash-screen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('splash-screen').style.display = 'none';
            document.getElementById('site-content').style.display = 'block';
            setTimeout(() => { 
                document.getElementById('site-content').style.opacity = '1'; 
                initApp();
            }, 50);
        }, 800);
    }, 3000);
});

function initApp() {
    new TradingView.widget({
        "container_id": "main-chart", "symbol": "BMFBOVESPA:IBOV",
        "interval": "D", "theme": "dark", "style": "3", "width": "100%", "height": "100%", "locale": "br"
    });
    loadData();
    setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000);
}

async function loadData() {
    const res = await fetch(CONFIG.SHEET_URL);
    const text = await res.text();
    const rows = text.split('\n').slice(1);
    const sectors = {};
    const highlights = document.getElementById('highlights-list');
    highlights.innerHTML = "";

    rows.forEach((row, index) => {
        const c = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if(c[0]) {
            const s = {
                ticker: c[0].replace(/"/g,''),
                price: c[2],
                pct: c[3]?.substring(0,6) || "0%",
                sector: (c[4] || "Outros").trim().replace(/"/g,'')
            };
            if(!sectors[s.sector]) sectors[s.sector] = [];
            sectors[s.sector].push(s);

            // Preenche destaques (primeiros 6)
            if(index < 6) {
                highlights.innerHTML += `
                    <div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #2b2f3a;">
                        <b>${s.ticker}</b> <span style="color:${s.pct.includes('-')?'var(--down)':'var(--up)'}">${s.pct}</span>
                    </div>`;
            }
        }
    });
    renderSectors(sectors);
}

function renderSectors(sectors) {
    const container = document.getElementById('sectors-container');
    container.innerHTML = "";
    for (const name in sectors) {
        const div = document.createElement('div');
        div.innerHTML = `<h2 class="sector-title">${name}</h2>`;
        const grid = document.createElement('div');
        grid.className = 'stocks-grid';
        sectors[name].forEach(s => {
            const isNeg = s.pct.includes('-');
            grid.innerHTML += `
                <div class="stock-card" onclick="window.location.href='detalhes.html?symbol=${s.ticker}'">
                    <div style="color:var(--accent); font-weight:800; font-size:12px;">${s.ticker}</div>
                    <div class="price">R$ ${s.price}</div>
                    <div style="color:${isNeg?'var(--down)':'var(--up)'}; font-weight:700;">${isNeg?'▼':'▲'} ${s.pct}</div>
                </div>`;
        });
        div.appendChild(grid);
        container.appendChild(div);
    }
}
