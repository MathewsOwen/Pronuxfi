const PronuxEngine = {
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
        setInterval(() => this.generateNewNews(true), 300000);
        
        let timeLeft = 60;
        setInterval(() => {
            timeLeft = timeLeft <= 1 ? 60 : timeLeft - 1;
            document.getElementById('timer').innerText = timeLeft;
        }, 1000);
    },

    initTV(symbol) {
        new TradingView.widget({
            "autosize": true, "symbol": symbol, "theme": "dark",
            "container_id": "tradingview_pronux", "backgroundColor": "#020617",
            "style": "1", "toolbar_bg": "#0f172a", "enable_publishing": false,
            "hide_side_toolbar": false, "allow_symbol_change": true, "locale": "br"
        });
    },

    loadNews() {
        const saved = JSON.parse(localStorage.getItem('pronux_v3_news')) || [];
        saved.forEach(n => this.injectNews(n, false));
        if(saved.length === 0) this.generateNewNews(false);
    },

    generateNewNews(play) {
        const titles = ["Fluxo institucional detectado na B3", "Morgan Stanley revisa alvo do Ibovespa", "Setor Tech lidera ganhos matinais", "Alerta de volatilidade em moedas"];
        const n = { title: titles[Math.floor(Math.random()*titles.length)], time: new Date().toLocaleTimeString() };
        const saved = JSON.parse(localStorage.getItem('pronux_v3_news')) || [];
        saved.unshift(n);
        localStorage.setItem('pronux_v3_news', JSON.stringify(saved.slice(0, 20)));
        this.injectNews(n, play);
    },

    injectNews(n, play) {
        const html = `<div class="asset-row" style="flex-direction:column; align-items:flex-start;">
            <small style="color:var(--gold); font-weight:800; font-size:10px;">PRONUX FEED • ${n.time}</small>
            <span style="margin-top:5px; font-weight:600;">${n.title}</span>
        </div>`;
        document.getElementById('newsFeed').insertAdjacentHTML('afterbegin', html);
        if(play) document.getElementById('notif-sound').play().catch(()=>{});
    },

    renderTicker() {
        const content = this.tickerData.map(item => `
            <div class="ticker-item"><img src="${item.img}" style="width:18px; border-radius:50%"> ${item.name} <b>${item.val}</b></div>
        `).join('');
        document.getElementById('globalTicker').innerHTML = content + content;
    },

    renderRankings() {
        const assets = ["PETR4", "VALE3", "ITUB4", "BBAS3", "BBDC4", "MGLU3", "WEGE3", "RENT3"];
        let data = assets.map(s => ({ symbol: s, val: (Math.random() * 6 - 3).toFixed(2) }));
        document.getElementById('highList').innerHTML = data.filter(a => a.val > 0).sort((a,b)=>b.val-a.val).map(a => `<div class="asset-row" onclick="PronuxEngine.initTV('BMFBOVESPA:${a.symbol}')"><span>${a.symbol}</span><span style="color:var(--green); font-weight:bold;">+${a.val}%</span></div>`).join('');
        document.getElementById('lowList').innerHTML = data.filter(a => a.val < 0).sort((a,b)=>a.val-b.val).map(a => `<div class="asset-row" onclick="PronuxEngine.initTV('BMFBOVESPA:${a.symbol}')"><span>${a.symbol}</span><span style="color:var(--red); font-weight:bold;">${a.val}%</span></div>`).join('');
    }
};

const PronuxAI = {
    update() {
        const bull = Math.random() > 0.5;
        const stocks = bull ? ["NVDA", "AAPL", "PETR4"] : ["GOLD", "USD/BRL", "VALE3"];
        document.getElementById('aiTopBuy').innerHTML = stocks.map(s => `<div style="margin-top:10px; font-weight:700;">• ${s} <small style="color:#64748b">(Institutional Buy)</small></div>`).join('');
        document.getElementById('aiRiskMatrix').innerHTML = `<div style="margin-top:10px">Risco Atual: <span class="risk-tag ${bull?'risk-low':'risk-high'}">${bull?'MINIMIZADO':'ELEVADO'}</span></div>`;
        document.getElementById('aiReportText').innerText = bull ? "O sistema identifica um padrão de acumulação severo nas 10 maiores corretoras. A tendência é de continuidade de momentum." : "O fluxo migrou para ativos de proteção. Recomendamos cautela extrema em ativos de alta volatilidade.";
        document.getElementById('gaugePointer').style.left = bull ? "80%" : "20%";
    }
};

window.switchTab = (t) => {
    document.querySelectorAll('.view-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(t + 'View').classList.remove('hidden');
    if(t === 'market') document.getElementById('rankingView').classList.remove('hidden');
    
    document.querySelectorAll('.nav-btn').forEach((b, i) => {
        b.classList.toggle('active', (t==='market'&&i===0) || (t==='news'&&i===1) || (t==='ai'&&i===2));
    });
    if(t === 'ai') PronuxAI.update();
};

window.toggleRanking = (type) => {
    document.getElementById('highList').classList.toggle('hidden', type === 'low');
    document.getElementById('lowList').classList.toggle('hidden', type === 'high');
    document.getElementById('btn-high').classList.toggle('active', type === 'high');
    document.getElementById('btn-low').classList.toggle('active', type === 'low');
};

document.addEventListener('DOMContentLoaded', () => PronuxEngine.init());
