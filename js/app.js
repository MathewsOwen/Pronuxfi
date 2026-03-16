const PronuxApp = {
    tickerData: [
        { name: "J.P. MORGAN", val: "198.45", s: "JPM", img: "https://logo.clearbit.com/jpmorgan.com" },
        { name: "GOLDMAN SACHS", val: "412.10", s: "GS", img: "https://logo.clearbit.com/goldmansachs.com" },
        { name: "BITCOIN", val: "64.215", s: "BTC", img: "https://cryptologos.cc/logos/bitcoin-btc-logo.png" },
        { name: "ETHEREUM", val: "3.482", s: "ETH", img: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
        { name: "IBOVESPA", val: "128.450", s: "B3", img: "https://logodownload.org/wp-content/uploads/2017/10/b3-logo.png" },
        { name: "S&P 500", val: "5.123", s: "SPX", img: "https://logo.clearbit.com/spglobal.com" }
    ],

    assets: ["PETR4", "VALE3", "ITUB4", "BBAS3", "BBDC4", "ELET3", "WEGE3", "RENT3", "SUZB3", "JBSS3", "MGLU3", "AMER3", "AZUL4", "GOLL4", "LREN3", "CVCB3", "VIIA3", "COGN3", "HAPV3", "BEEF3"],

    init() {
        this.renderTicker();
        this.renderRankings();
        this.initTV("BMFBOVESPA:IBOV");
        this.renderNews(false);
        
        setInterval(() => this.renderRankings(), 60000);
        setInterval(() => this.renderNews(true), 300000); // 5 minutos
        
        let timeLeft = 60;
        setInterval(() => {
            timeLeft = timeLeft <= 1 ? 60 : timeLeft - 1;
            document.getElementById('timer').innerText = timeLeft;
        }, 1000);
    },

    initTV(symbol) {
        new TradingView.widget({
            "autosize": true, "symbol": symbol, "theme": "dark",
            "container_id": "tradingview_pronux", "backgroundColor": "#001d3d",
            "gridColor": "rgba(255, 195, 0, 0.05)", "locale": "br"
        });
    },

    renderTicker() {
        const track = document.getElementById('globalTicker');
        const content = this.tickerData.map(item => `
            <div class="ticker-item">
                <img src="${item.img}" onerror="this.src='https://ui-avatars.com/api/?name=${item.s}&background=ffc300&color=000'">
                ${item.name} <b>${item.val}</b>
            </div>
        `).join('');
        track.innerHTML = content + content;
    },

    renderRankings() {
        const hList = document.getElementById('highList');
        const lList = document.getElementById('lowList');
        
        let data = this.assets.map(s => ({ symbol: s, val: parseFloat((Math.random() * 8 - 4).toFixed(2)) }));
        const sortedHighs = [...data].sort((a, b) => b.val - a.val).slice(0, 10);
        const sortedLows = [...data].sort((a, b) => a.val - b.val).slice(0, 10);

        hList.innerHTML = sortedHighs.map(a => `<div class="asset-row" onclick="PronuxApp.initTV('BMFBOVESPA:${a.symbol}')"><span>${a.symbol}</span><span style="color:var(--green)">▲ ${a.val}%</span></div>`).join('');
        lList.innerHTML = sortedLows.map(a => `<div class="asset-row" onclick="PronuxApp.initTV('BMFBOVESPA:${a.symbol}')"><span>${a.symbol}</span><span style="color:var(--red)">▼ ${a.val}%</span></div>`).join('');
    },

    renderNews(playSound) {
        const feed = document.getElementById('newsFeed');
        const portals = ["CNN BUSINESS", "BLOOMBERG", "REUTERS", "PRONUX INSIGHTS"];
        const portal = portals[Math.floor(Math.random() * portals.length)];
        const html = `
            <a href="https://www.google.com/search?q=finance+news" target="_blank" class="news-item">
                <small style="color:var(--gold)">${portal} • AGORA</small>
                <h3>Movimentação atípica detectada em ativos de tecnologia.</h3>
                <p style="font-size:12px; color:#555; margin-top:10px">Clique para abrir o portal oficial de notícias.</p>
            </a>`;
        feed.insertAdjacentHTML('afterbegin', html);
        if(playSound) document.getElementById('notif-sound').play().catch(()=>{});
    }
};

const PronuxAI = {
    run() {
        const isBull = Math.random() > 0.5;
        const sentiment = isBull ? 'GANÂNCIA' : 'MEDO';
        const vol = (Math.random() * 2 + 0.5).toFixed(2);
        const pointer = document.getElementById('gaugePointer');
        
        document.getElementById('aiSentiment').innerText = sentiment;
        document.getElementById('aiSentiment').style.color = isBull ? 'var(--green)' : 'var(--red)';
        document.getElementById('aiVol').innerText = vol + "%";
        
        // Ponteiro do Medo e Ganância
        const pos = isBull ? Math.random() * 40 + 55 : Math.random() * 40 + 5;
        pointer.style.left = pos + "%";

        document.getElementById('aiReportText').innerText = isBull 
            ? "O motor neural PRONUX identifica um cenário de apetite ao risco. O fluxo comprador institucional está focado em ativos de beta alto. Projeção estatística de curto prazo é positiva."
            : "Alerta de correção. O índice de medo PRONUX subiu devido à volatilidade macroeconômica. Recomendamos cautela em posições alavancadas.";
    }
};

window.switchTab = (t) => {
    document.getElementById('marketView').classList.toggle('hidden', t !== 'market');
    document.getElementById('rankingView').classList.toggle('hidden', t !== 'market');
    document.getElementById('aiView').classList.toggle('hidden', t !== 'ai');
    document.getElementById('newsView').classList.toggle('hidden', t !== 'news');
    
    document.querySelectorAll('.nav-link-pill').forEach((btn, idx) => {
        btn.classList.remove('active');
        if((t==='market' && idx===0) || (t==='news' && idx===1) || (t==='ai' && idx===2)) btn.classList.add('active');
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
