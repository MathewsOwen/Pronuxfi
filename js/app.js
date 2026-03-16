/**
 * PRONUXFIN - Core Engine
 * Versão: 3.5 "Masterpiece"
 */

const PronuxApp = {
    state: {
        tickers: [
            { s: "BTC", n: "BITCOIN", v: "64.120", img: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
            { s: "ETH", n: "ETHEREUM", v: "3.450", img: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
            { s: "BRL", n: "USD/BRL", v: "5.02", img: "https://upload.wikimedia.org/wikipedia/commons/0/05/Flag_of_Brazil.svg" },
            { s: "IBOV", n: "IBOVESPA", v: "128.450", img: "https://logodownload.org/wp-content/uploads/2017/10/b3-logo.png" }
        ],
        assets: ["PETR4", "VALE3", "ITUB4", "BBAS3", "BBDC4", "MGLU3", "WEGE3", "RENT3"]
    },

    init() {
        this.renderTicker();
        this.renderRankings();
        this.initTradingView("BMFBOVESPA:IBOV");
        this.loadPersistentNews();
        this.setupEventListeners();

        // Inicializa Loops de Atualização
        setInterval(() => this.renderRankings(), 60000);
        setInterval(() => this.updateTimer(), 1000);
        setInterval(() => this.generateNews(true), 300000); // 5 minutos
    },

    setupEventListeners() {
        // Delegação de evento para abas
        document.querySelector('.main-nav').addEventListener('click', (e) => {
            const btn = e.target.closest('.nav-item');
            if (btn) this.switchTab(btn.dataset.tab);
        });

        // Evento para Ranking
        document.querySelector('.ranking-tabs').addEventListener('click', (e) => {
            const btn = e.target.closest('.rank-tab');
            if (btn) this.toggleRanking(btn.dataset.rank);
        });
    },

    initTradingView(symbol) {
        const container = document.getElementById("tradingview_pronux");
        if (!container) return;
        
        container.innerHTML = ""; // Hard clean
        new TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "theme": "dark",
            "style": "1",
            "container_id": "tradingview_pronux",
            "backgroundColor": "#0d121f",
            "gridColor": "rgba(255,255,255,0.02)",
            "locale": "br"
        });
    },

    switchTab(tabId) {
        document.querySelectorAll('.tab-view').forEach(v => v.classList.add('hidden'));
        document.getElementById(tabId + 'View')?.classList.remove('hidden');

        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });

        if (tabId === 'ai') PronuxAI.analyze();
    },

    renderRankings() {
        const data = this.state.assets.map(s => ({ s, v: (Math.random() * 6 - 3).toFixed(2) }));
        const highList = document.getElementById("highList");
        const lowList = document.getElementById("lowList");

        const buildHTML = (list) => list.map(a => `
            <div class="asset-row" onclick="PronuxApp.initTradingView('BMFBOVESPA:${a.s}')">
                <span>${a.s}</span>
                <b style="color:var(--${a.v > 0 ? 'green' : 'red'})">${a.v > 0 ? '+' : ''}${a.v}%</b>
            </div>
        `).join('');

        if (highList) highList.innerHTML = buildHTML(data.filter(a => a.v > 0).sort((a,b) => b.v - a.v));
        if (lowList) lowList.innerHTML = buildHTML(data.filter(a => a.v < 0).sort((a,b) => a.v - b.v));
    },

    loadPersistentNews() {
        const saved = JSON.parse(localStorage.getItem('pronux_news_v3')) || [];
        const feed = document.getElementById('newsFeed');
        if (!feed) return;

        if (saved.length === 0) return this.generateNews(false);

        feed.innerHTML = saved.map(n => `
            <div class="asset-row" style="flex-direction:column; align-items:flex-start;">
                <small style="color:var(--gold); font-weight:800; font-size:10px">${n.time} • PRONUX INSIGHT</small>
                <div style="margin-top:5px; font-weight:600">${n.title}</div>
            </div>
        `).join('');
    },

    generateNews(playAlert) {
        const insights = [
            "Fluxo institucional detectado em Blue Chips.",
            "Morgan Stanley revisa alvo do Ibovespa para 142k.",
            "IA alerta para zona de exaustão vendedora.",
            "Volume atípico identificado em opções de PETR4."
        ];
        const n = { 
            title: insights[Math.floor(Math.random() * insights.length)], 
            time: new Date().toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'}) 
        };
        
        const saved = JSON.parse(localStorage.getItem('pronux_news_v3')) || [];
        saved.unshift(n);
        localStorage.setItem('pronux_news_v3', JSON.stringify(saved.slice(0, 15)));
        
        this.loadPersistentNews();
        if (playAlert) document.getElementById('notif-sound')?.play().catch(()=>{});
    },

    updateTimer() {
        const el = document.getElementById("timer");
        if (el) {
            let val = parseInt(el.innerText);
            el.innerText = val <= 1 ? 60 : val - 1;
        }
    },

    renderTicker() {
        const track = document.getElementById("globalTicker");
        const content = this.state.tickers.map(t => `
            <div class="ticker-item"><img src="${t.img}" width="18"> ${t.n} <b>${t.v}</b></div>
        `).join('');
        track.innerHTML = content + content;
    },

    toggleRanking(type) {
        document.getElementById("highList").classList.toggle("hidden", type === "low");
        document.getElementById("lowList").classList.toggle("hidden", type === "high");
        document.getElementById("btn-high").classList.toggle("active", type === "high");
        document.getElementById("btn-low").classList.toggle("active", type === "low");
    }
};

const PronuxAI = {
    analyze() {
        const isBull = Math.random() > 0.5;
        const pointer = document.getElementById("gaugePointer");
        
        document.getElementById("aiTopBuy").innerHTML = (isBull ? ["NVDA", "AAPL", "PETR4"] : ["GOLD", "USD/BRL", "VALE3"])
            .map(s => `<div style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05)">• ${s} <small style="color:var(--text-dim)">Institutional</small></div>`).join('');

        document.getElementById("aiRiskMatrix").innerHTML = `
            <div>TENDÊNCIA: <b style="color:var(--gold)">${isBull ? 'ALTA FREQUÊNCIA' : 'LATERALIZAÇÃO'}</b></div>
            <div style="margin-top:10px">RISCO: <b style="color:var(--${isBull?'green':'red'})">${isBull?'CONTROLADO':'ELEVADO'}</b></div>
        `;

        document.getElementById("aiReportText").innerText = isBull 
            ? "Padrão de acumulação identificado. O fluxo comprador institucional sugere continuidade do momentum nas próximas sessões." 
            : "Distribuição detectada. Grandes players estão reduzindo exposição. Sugere-se hedge ou aumento de liquidez em conta.";

        if (pointer) pointer.style.left = isBull ? "82%" : "22%";
    }
};

// Start
document.addEventListener("DOMContentLoaded", () => PronuxApp.init());
