const AlphaCore = {
    // Configurações do Ticker
    tickerData: [
        { name: "USD/BRL", val: "5.02", img: "https://flagcdn.com/w40/br.png" },
        { name: "IBOVESPA", val: "128.450", img: "https://upload.wikimedia.org/wikipedia/commons/4/4b/B3_Logo.png" },
        { name: "S&P 500", val: "5.120", img: "https://logo.clearbit.com/spglobal.com" },
        { name: "NASDAQ", val: "16.270", img: "https://logo.clearbit.com/nasdaq.com" },
        { name: "BITCOIN", val: "64.120", img: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
        { name: "ETHEREUM", val: "3.450", img: "https://cryptologos.cc/logos/ethereum-eth-logo.png" }
    ],

    highAssets: ["PETR4", "VALE3", "ITUB4", "BBAS3", "BBDC4", "ELET3", "WEGE3", "RENT3", "SUZB3", "JBSS3"],
    lowAssets: ["MGLU3", "AMER3", "AZUL4", "GOLL4", "LREN3", "CVCB3", "VIIA3", "COGN3", "HAPV3", "BEEF3"],

    init() {
        this.renderTicker();
        this.renderRankings();
        this.initTV("BMFBOVESPA:IBOV");
        this.renderNews(false);

        // Ciclo de 1 minuto para Rankings
        setInterval(() => this.renderRankings(), 60000);
        
        // Contador visual do timer
        let timeLeft = 60;
        setInterval(() => {
            timeLeft = timeLeft <= 1 ? 60 : timeLeft - 1;
            document.getElementById('timer').innerText = timeLeft;
        }, 1000);

        // Ciclo de 30 minutos para Notícias
        setInterval(() => this.renderNews(true), 1800000);
    },

    renderTicker() {
        const track = document.getElementById('globalTicker');
        const content = this.tickerData.map(item => `
            <div class="ticker-item"><img src="${item.img}"> ${item.name} <b>${item.val}</b></div>
        `).join('');
        track.innerHTML = content + content;
    },

    initTV(symbol) {
        new TradingView.widget({
            "autosize": true, "symbol": symbol, "theme": "dark",
            "container_id": "tradingview_alpha", "backgroundColor": "#001633",
            "gridColor": "rgba(211, 175, 55, 0.05)", "locale": "br"
        });
    },

    renderRankings() {
        const hList = document.getElementById('highList');
        const lList = document.getElementById('lowList');
        hList.innerHTML = ""; lList.innerHTML = "";

        this.highAssets.forEach(s => {
            const perc = (Math.random() * 4 + 0.5).toFixed(2);
            hList.innerHTML += `<div class="asset-row" onclick="AlphaCore.initTV('BMFBOVESPA:${s}')">
                <span>${s}</span><span style="color:var(--green)">▲ ${perc}%</span></div>`;
        });

        this.lowAssets.forEach(s => {
            const perc = (Math.random() * 4 + 0.5).toFixed(2);
            lList.innerHTML += `<div class="asset-row" onclick="AlphaCore.initTV('BMFBOVESPA:${s}')">
                <span>${s}</span><span style="color:var(--red)">▼ ${perc}%</span></div>`;
        });
    },

    renderNews(playSound) {
        const feed = document.getElementById('newsFeed');
        const newsList = [
            {n: "BLOOMBERG", t: "Fluxo de capital estrangeiro bate recorde na B3.", u: "https://www.bloomberg.com.br"},
            {n: "REUTERS", t: "Ouro atinge máxima histórica com busca por segurança.", u: "https://www.reuters.com"},
            {n: "VALOR", t: "Bancos centrais sinalizam manutenção de taxas elevadas.", u: "https://valor.globo.com"}
        ];
        const item = newsList[Math.floor(Math.random() * newsList.length)];
        const html = `
            <a href="${item.u}" target="_blank" class="news-item">
                <small style="color:var(--gold)">${item.n} • AGORA</small>
                <h3 style="margin-top:10px">${item.t}</h3>
                <p style="font-size:12px; color:#555; margin-top:10px">Ver matéria completa →</p>
            </a>`;
        feed.insertAdjacentHTML('afterbegin', html);
        if(playSound) document.getElementById('notif-sound').play().catch(()=>{});
    }
};

window.switchTab = (t) => {
    document.getElementById('marketView').classList.toggle('hidden', t === 'news');
    document.getElementById('rankingView').classList.toggle('hidden', t === 'news');
    document.getElementById('newsView').classList.toggle('hidden', t === 'market');
    document.querySelectorAll('.nav-link-pill').forEach((b, i) => b.classList.toggle('active', (i === 0 && t === 'market') || (i === 1 && t === 'news')));
};

window.toggleRanking = (type) => {
    document.getElementById('highList').classList.toggle('hidden', type === 'low');
    document.getElementById('lowList').classList.toggle('hidden', type === 'high');
    document.getElementById('btn-high').classList.toggle('active', type === 'high');
    document.getElementById('btn-low').classList.toggle('active', type === 'low');
};

document.addEventListener('DOMContentLoaded', () => AlphaCore.init());
