const AlphaCore = {
    // Links reais de notícias para simular portal
    newsData: [
        { portal: "INFO MONEY", url: "https://www.infomoney.com.br", title: "Ibovespa opera em alta com foco no cenário fiscal." },
        { portal: "VALOR", url: "https://valor.globo.com", title: "Dólar recua perante moedas emergentes nesta manhã." },
        { portal: "BLOOMBERG", url: "https://www.bloomberg.com.br", title: "Ações de tecnologia lideram ganhos em Nova York." },
        { portal: "REUTERS", url: "https://www.reuters.com", title: "Petróleo Brent sobe por temores de oferta no Oriente Médio." }
    ],

    init() {
        this.renderRankings();
        this.initTV("BMFBOVESPA:IBOV");
        this.renderNews(false);
        // Atualização a cada 30 minutos (1.800.000 ms)
        setInterval(() => this.renderNews(true), 1800000);
    },

    initTV(symbol) {
        new TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "theme": "dark",
            "container_id": "tradingview_alpha",
            "backgroundColor": "#001633",
            "gridColor": "rgba(211, 175, 55, 0.05)",
            "locale": "br"
        });
    },

    renderRankings() {
        const highs = ["VALE3", "PETR4", "ITUB4", "BBAS3", "BBDC4", "ELET3", "WEGE3", "RENT3", "SUZB3", "JBSS3"];
        const lows = ["MGLU3", "AMER3", "AZUL4", "GOLL4", "LREN3", "CVCB3", "VIIA3", "COGN3", "HAPV3", "BEEF3"];
        
        highs.forEach(s => {
            document.getElementById('highList').innerHTML += `<div class="asset-row" onclick="AlphaCore.initTV('BMFBOVESPA:${s}')"><span>${s}</span><span style="color:var(--green)">+${(Math.random()*5).toFixed(2)}%</span></div>`;
        });
        lows.forEach(s => {
            document.getElementById('lowList').innerHTML += `<div class="asset-row" onclick="AlphaCore.initTV('BMFBOVESPA:${s}')"><span>${s}</span><span style="color:var(--red)">-${(Math.random()*5).toFixed(2)}%</span></div>`;
        });
    },

    renderNews(playSound) {
        const feed = document.getElementById('newsFeed');
        const itemData = this.newsData[Math.floor(Math.random() * this.newsData.length)];
        const now = new Date().toLocaleTimeString();

        const newsHTML = `
            <a href="${itemData.url}" target="_blank" class="news-item">
                <small style="color:var(--gold)">${itemData.portal} • ${now}</small>
                <h3 style="margin-top:8px">${itemData.title}</h3>
                <p style="font-size:12px; color:#777; margin-top:10px">Clique para ler a matéria completa no portal.</p>
            </a>`;
        
        feed.insertAdjacentHTML('afterbegin', newsHTML);

        if(playSound) {
            document.getElementById('notif-sound').play().catch(() => {});
        }
    }
};

// Funções Globais
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
