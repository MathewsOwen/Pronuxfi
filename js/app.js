document.addEventListener('DOMContentLoaded', () => {
    const graphArea = document.getElementById('graphArea');

    // Cria os candles (velas) do gráfico automaticamente
    for (let i = 0; i < 30; i++) {
        const candle = document.createElement('div');
        candle.className = 'candle';
        const height = Math.floor(Math.random() * 200) + 50;
        candle.style.height = `${height}px`;
        graphArea.appendChild(candle);
    }

    // Faz o gráfico "pulsar" simulando movimento real
    setInterval(() => {
        const candles = document.querySelectorAll('.candle');
        candles.forEach(c => {
            const change = Math.floor(Math.random() * 20) - 10;
            let currentHeight = parseInt(c.style.height);
            c.style.height = `${Math.max(20, currentHeight + change)}px`;
        });
    }, 1000);

    // Botão de Login
    document.getElementById('loginBtn').addEventListener('click', () => {
        alert('FIREBASE_CONNECTION: Estabelecendo túnel de dados criptografado...');
    });
});
