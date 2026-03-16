/**
 * PRONUXFIN - High Performance API Engine
 * Focada em velocidade, tratamento de erro e UI dinâmica
 */

async function loadCrypto() {
    // Adicionei Solana conforme seu código novo
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true";
    const container = document.getElementById("cryptoTable");

    if (!container) return;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("API Limit reached");
        const data = await res.json();

        // Criando uma estrutura de dados para facilitar o loop
        const coins = [
            { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: data.bitcoin.usd, change: data.bitcoin.usd_24h_change },
            { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: data.ethereum.usd, change: data.ethereum.usd_24h_change },
            { id: 'solana', name: 'Solana', symbol: 'SOL', price: data.solana.usd, change: data.solana.usd_24h_change }
        ];

        // Renderização Profissional com Grid/Table
        container.innerHTML = coins.map(coin => `
            <div class="market-row-premium">
                <div class="coin-info">
                    <span class="coin-name">${coin.name}</span>
                    <span class="coin-symbol">${coin.symbol}</span>
                </div>
                <div class="coin-price">
                    $${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div class="coin-status ${coin.change >= 0 ? 'up' : 'down'}">
                    ${coin.change >= 0 ? '▲' : '▼'} ${Math.abs(coin.change).toFixed(2)}%
                </div>
            </div>
        `).join('');

        console.log("🚀 Crypto Data Synced");

    } catch (err) {
        console.error("Erro na API:", err);
        container.innerHTML = `<p style="color: var(--red); font-size: 12px; padding: 20px;">
            ⚠️ Conexão instável. Tentando reconectar...
        </p>`;
        // Tenta novamente em 10 segundos se falhar
        setTimeout(loadCrypto, 10000);
    }
}

// Inicializa e define intervalo de 30 segundos para manter os dados sempre frescos
document.addEventListener("DOMContentLoaded", () => {
    loadCrypto();
    setInterval(loadCrypto, 30000); 
});
