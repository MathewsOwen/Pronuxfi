const AlphaCore = {
    // Simulando 10 Altas e 10 Baixas
    highs: ["PETR4", "VALE3", "ITUB4", "BBDC4", "BBAS3", "RENT3", "WEGE3", "SUZB3", "JBSS3", "ELET3"],
    lows: ["MGLU3", "AMER3", "AZUL4", "CVCB3", "VIIA3", "BHIA3", "COGN3", "GOLL4", "LREN3", "HAPV3"],

    newsSources: [
        { portal: "BLOOMBERG", title: "FED mantém taxas; mercado reage positivamente." },
        { portal: "INFO MONEY", title: "Ibovespa rompe barreira histórica com fluxo estrangeiro." },
        { portal: "VALOR ECONÔMICO", title: "Nova política fiscal deve ser votada nesta terça." },
        { portal: "REUTERS", title: "Petróleo sobe 2% com tensões no Oriente Médio." },
        { portal: "B3 OFICIAL", title: "Novas regras de listagem entram em vigor." },
        { portal: "CNN BUSINESS", title: "Inflação nos EUA vem abaixo do esperado." }
    ],

    init() {
        this.renderRankings();
        this.renderNews();
        this.initTV("BMFBOVESPA:IBOV");
        // Loop de atualização das notícias (1 em 1 minuto)
        setInterval(() => this.renderNews(), 60000);
    },

    initTV(symbol) {
        new TradingView.widget({
            "autosize": true,
            "symbol": symbol,
            "interval": "D",
            "timezone": "America/Sao_Paulo",
            "theme": "dark",
            "container_id": "tradingview_alpha",
            "backgroundColor": "#001e4d", // Azul Marinho
            "gridColor": "rgba(197, 160, 89, 0.1)" // Grid dourada suave
        });
    },

    renderRankings() {
        const highCont = document.getElementById('highList');
        const lowCont = document.getElementById('lowList');

        this.highs.forEach(s => {
            highCont.innerHTML += `<div class="asset-row"><span>${s}</span><span style="color:#00ff8c">+${(Math.random()*4).toFixed(2)}%</span></div>`;
        });

        this.lows.forEach(s => {
            lowCont.innerHTML += `<div class="asset-row"><span>${s}</span><span style="color:#ff3c5f">-${(Math.random()*4).toFixed(2)}%</span></div>`;
        });
    },

    renderNews() {
        const feed = document.getElementById('newsFeed');
        feed.innerHTML = ''; // Limpa para atualizar
        // Pegando fontes aleatórias para simular tempo real
        this.newsSources.sort(() => Math.random() - 0.5).forEach(n => {
            const now = new Date().toLocaleTimeString();
            feed.innerHTML += `
                <div class="news-item">
                    <small>${n.portal} • ${now}</small>
                    <h4>${n.title}</h4>
                </div>`;
        });
    },

    switchTab(tab) {
        // Lógica para trocar entre mercado e notícias
        const market = document.getElementById('marketView');
        const ranking = document.getElementById('rankingView');
        const news = document.getElementById('newsView');

        if(tab === 'news') {
            market.classList.add('hidden');
            ranking.classList.add('hidden');
            news.classList.remove('hidden');
        } else {
            market.classList.remove('hidden');
            ranking.classList.remove('hidden');
            news.classList.add('hidden');
        }
    }
};

// Global switch
window.switchTab = (t) => AlphaCore.switchTab(t);
document.addEventListener('DOMContentLoaded', () => AlphaCore.init());
