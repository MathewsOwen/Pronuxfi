/**
 * PRONUXFIN - Live Intelligence News Feed
 * Simula um terminal Bloomberg/Reuters em tempo real
 */

const NewsEngine = {
    // Base de dados de eventos para gerar notícias dinâmicas
    templates: [
        "Fluxo institucional detectado em {asset}.",
        "Baleias de {asset} movimentam grandes volumes nas últimas horas.",
        "Analistas revisam projeção de {asset} para o fechamento do trimestre.",
        "Cenário macro global impacta diretamente o preço de {asset}.",
        "IA Pronux identifica zona de acumulação importante em {asset}.",
        "Volatilidade em {asset} atinge nível máximo dos últimos 30 dias."
    ],
    assets: ["Bitcoin", "Ethereum", "Ibovespa", "PETR4", "VALE3", "Dólar", "Solana"],

    init() {
        this.loadNews();
        // Gera uma notícia nova a cada 5 minutos para manter o site "vivo"
        setInterval(() => this.generateFakeNews(), 300000);
    },

    loadNews() {
        const feed = document.getElementById("newsFeed");
        if (!feed) return;

        // Recupera do localStorage ou usa as iniciais se estiver vazio
        let savedNews = JSON.parse(localStorage.getItem("pronux_news")) || [
            { time: "10:45", text: "Mercado reage a decisão do FED sobre taxas de juros." },
            { time: "10:30", text: "Bitcoin sustenta suporte acima dos $64k com força institucional." },
            { time: "10:15", text: "Ibovespa opera em leilão após oscilação atípica em Blue Chips." }
        ];

        this.render(feed, savedNews);
    },

    generateFakeNews() {
        const feed = document.getElementById("newsFeed");
        if (!feed) return;

        const randomTemplate = this.templates[Math.floor(Math.random() * this.templates.length)];
        const randomAsset = this.assets[Math.floor(Math.random() * this.assets.length)];
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        const newEntry = {
            time: time,
            text: randomTemplate.replace("{asset}", randomAsset)
        };

        // Atualiza o Storage (mantém apenas as últimas 10 notícias)
        let savedNews = JSON.parse(localStorage.getItem("pronux_news")) || [];
        savedNews.unshift(newEntry);
        savedNews = savedNews.slice(0, 10);
        localStorage.setItem("pronux_news", JSON.stringify(savedNews));

        this.render(feed, savedNews);
        this.playNotification();
    },

    render(container, newsList) {
        container.innerHTML = newsList.map(n => `
            <div class="news-card-premium">
                <div class="news-meta">
                    <span class="news-time">${n.time}</span>
                    <span class="news-tag">LIVE</span>
                </div>
                <div class="news-body">${n.text}</div>
            </div>
        `).join("");
    },

    playNotification() {
        // Opcional: Toca um bip discreto quando entra notícia nova
        console.log("🔔 Nova inteligência de mercado disponível.");
    }
};

document.addEventListener("DOMContentLoaded", () => NewsEngine.init());
