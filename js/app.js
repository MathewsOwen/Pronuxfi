const PronuxApp = {
    tickerData: [
        { name: "J.P. MORGAN", val: "198.45", s: "JPM", img: "https://logo.clearbit.com/jpmorgan.com" },
        { name: "GOLDMAN SACHS", val: "412.10", s: "GS", img: "https://logo.clearbit.com/goldmansachs.com" },
        { name: "BITCOIN", val: "64.120", s: "BTC", img: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
        { name: "IBOVESPA", val: "128.450", s: "B3", img: "https://logodownload.org/wp-content/uploads/2017/10/b3-logo.png" }
    ],

    init() {
        this.renderTicker();
        this.renderRankings();
        this.initTV("BMFBOVESPA:IBOV");
        this.loadNews();
        
        setInterval(() => this.renderRankings(), 60000);
        setInterval(() => this.generateNews(true), 300000);
        
        let timeLeft = 60;
        setInterval(() => {
            timeLeft = timeLeft <= 1 ? 60 : timeLeft - 1;
            const timerEl = document.getElementById('timer');
            if(timerEl) timerEl.innerText = timeLeft;
        }, 1000);
    },

    initTV(symbol) {
        if(document.getElementById('tradingview_pronux')) {
            new TradingView.widget({
                "autosize": true, "symbol": symbol, "theme": "dark",
                "container_id": "tradingview_pronux", "backgroundColor": "#020617",
                "style": "1", "locale": "br", "toolbar_bg": "#0f172a"
            });
        }
    },

    loadNews() {
        const saved = JSON.parse(localStorage.getItem('pronux_v3_news')) || [];
        saved.forEach(n => this.injectNewsHTML(n));
        if(saved.length === 0) this.generateNews(false);
    },

    generateNews(play) {
        const titles = ["Fluxo comprador na B3", "Morgan Stanley revisa alvo", "Setor Tech em alta", "Alerta de Volatilidade"];
        const n = { title: titles[Math.floor(Math.random()*titles.length)], time: new Date().toLocaleTimeString() };
        const saved = JSON.parse(localStorage.getItem('pronux_v3_news')) || [];
        saved.unshift(n);
        localStorage.setItem('pronux_v3_news', JSON.stringify(saved.slice(0, 15)));
        this.injectNewsHTML(n);
        if(play) document.getElementById('notif-sound').play().catch(()=>{});
    },

    injectNewsHTML(n) {
        const feed = document.getElementById('newsFeed');
        if(!feed) return;
        const html = `<div class="asset-row" style="flex-direction:column; align-items:flex-start;">
            <small style="color:var(--gold); font-size:10px;">PRONUX FEED • ${n.time}</small>
            <span style="margin-top:4px; font-weight:600;">${n.title}</span>
        </div>`;
        feed.insertAdjacentHTML('afterbegin', html);
    },

    renderTicker() {
        const track = document.getElementById('globalTicker');
        const content = this.tickerData.map(item => `
            <div class="ticker-item"><img src="${item.img}" style="width:16px; border-radius:50%"> ${item.name} <b>${item.val}</b></div>
        `).join('');
        track.innerHTML = content + content;
    },

    renderRankings() {
        const assets = ["PETR4", "VALE3", "ITUB4", "BBAS3", "BBDC4", "MGLU3", "WEGE3", "RENT3"];
        let data = assets.map(s => ({ symbol: s, val: (Math.random() * 6 - 3).toFixed(2) }));
        document.getElementById('highList').innerHTML = data.filter(a => a.val > 0).sort((a,b)=>b.val-a.val).map(a => `<div class="asset-row" onclick="PronuxApp.initTV('BMFBOVESPA:${a.symbol}')"><span>${a.symbol}</span><span style="color:var(--green)">+${a.val}%</span></div>`).join('');
        document.getElementById('lowList').innerHTML = data.filter(a => a.val < 0).sort((a,b)=>a.val-b.val).map(a => `<div class="asset-row" onclick="PronuxApp.initTV('BMFBOVESPA:${a.symbol}')"><span>${a.symbol}</span><span style="color:var(--red)">${a.val}%</span></div>`).join('');
    }
};

const PronuxAI = {
    run() {
        const bull = Math.random() > 0.5;
        document.getElementById('aiTopBuy').innerHTML = (bull ? ["NVDA", "AAPL", "PETR4"] : ["GOLD", "USD/BRL", "VALE3"]).map(s => `<div>• ${s}</div>`).join('');
        document.getElementById('aiRiskMatrix').innerHTML = `<div>Risco: <span style="color:${bull?'var(--green)':'var(--red)'}">${bull?'BAIXO':'ALTO'}</span></div>`;
        document.getElementById('aiReportText').innerText = bull ? "Acumulação institucional detectada. Cenário favorável para momentum." : "Migração para ativos defensivos detectada. Cautela recomendada.";
        document.getElementById('gaugePointer').style.left = bull ? "80%" : "20%";
    }
};

window.switchTab = (t) => {
    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(t + 'View').classList.remove('hidden');
    
    // O Ranking deve sumir na aba de Notícias se a tela for pequena
    document.getElementById('rankingView').style.display = (t === 'news' && window.innerWidth < 1100) ? 'none' : 'block';

    document.querySelectorAll('.nav-btn').forEach((b, i) => {
        b.classList.toggle('active', (t==='market'&&i===0) || (t==='news'&&i===1) || (t==='ai'&&i===2));
    });
    if(t === 'ai') PronuxAI.run();
};

window.toggleRanking = (type) => {
    document.getElementById('highList').classList.toggle('hidden', type === 'low');
    document.getElementById('lowList').classList.toggle('hidden', type === 'high');
    document.getElementById('btn-high').classList.toggle('active', type === 'high');
    document.getElementById('btn-low').classList.toggle('active', type === 'low');
};

document.addEventListener('DOMContentLoaded', () => PronuxApp.init());
