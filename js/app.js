const AlphaCore = {
    // Dados Fixos
    banks: ["J.P. MORGAN", "GOLDMAN SACHS", "CITIGROUP", "BOFA", "MORGAN STANLEY", "HSBC", "UBS", "BARCLAYS", "BNP PARIBAS", "SANTANDER"],
    assets: [
        { s: "PETR4", n: "Petrobras", t: "up" },
        { s: "VALE3", n: "Vale SA", t: "up" },
        { s: "ITUB4", n: "Itaú Unibanco", t: "up" },
        { s: "MGLU3", n: "Magaz. Luiza", t: "down" },
        { s: "AMER3", n: "Americanas", t: "down" },
        { s: "AZUL4", n: "Azul Linhas", t: "down" }
    ],

    init() {
        this.renderTicker();
        this.renderMovers();
        this.initTV("BMFBOVESPA:IBOV");
        this.initNav();
        this.startClock();
    },

    initTV(symbol) {
        new TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "interval": "D",
            "timezone": "America/Sao_Paulo",
            "theme": "dark",
            "style": "1",
            "locale": "br",
            "toolbar_bg": "#000000",
            "enable_publishing": false,
            "hide_top_toolbar": false,
            "container_id": "tradingview_alpha",
            "backgroundColor": "#050505",
            "gridColor": "#151515"
        });
    },

    renderTicker() {
        const div = document.getElementById('bankTicker');
        [...this.banks, ...this.banks].forEach(b => {
            div.innerHTML += `<div class="bank-unit">${b} <b>+${(Math.random()*3).toFixed(2)}%</b></div>`;
        });
    },

    renderMovers() {
        const list = document.getElementById('moversList');
        this.assets.forEach(a => {
            const row = document.createElement('div');
            row.className = 'mover-row';
            row.innerHTML = `<span>${a.s} <small style="color:#333;margin-left:5px">${a.n}</small></span>
                             <span class="${a.t}">${a.t === 'up' ? '+' : '-'}${(Math.random()*5).toFixed(2)}%</span>`;
            row.onclick = () => this.initTV(`BMFBOVESPA:${a.s}`);
            list.appendChild(row);
        });
    },

    initNav() {
        const btns = document.querySelectorAll('.nav-link');
        btns.forEach(btn => {
            btn.onclick = () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Switch de views
                const target = btn.getAttribute('data-target');
                document.querySelectorAll('.viewport > div').forEach(v => v.classList.add('hidden'));
                const targetEl = document.getElementById(`view-${target}`);
                if(target === 'dashboard') targetEl.classList.add('active');
                targetEl.classList.remove('hidden');
            };
        });
    },

    startClock() {
        setInterval(() => {
            document.getElementById('clock').innerText = new Date().toLocaleTimeString('pt-BR');
        }, 1000);
    }
};

document.addEventListener('DOMContentLoaded', () => AlphaCore.init());
