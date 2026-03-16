const Terminal = {
    init() {
        this.renderChart();
        this.clock();
        this.aiLogic();
    },
    renderChart() {
        const chart = LightweightCharts.createChart(document.getElementById('tvChart'), {
            layout: { backgroundColor: '#0a0a0a', textColor: '#555' },
            grid: { vertLines: { color: '#1a1a1a' }, horzLines: { color: '#1a1a1a' } },
            crosshair: { mode: LightweightCharts.CrosshairMode.Normal },
            rightPriceScale: { borderColor: '#1a1a1a' },
            timeScale: { borderColor: '#1a1a1a' },
        });

        const lineSeries = chart.addLineSeries({ color: '#00ff88', lineWidth: 2 });
        // Dados simulando o mercado
        let data = Array.from({length: 100}, (_, i) => ({
            time: (Date.now() / 1000) - (100 - i) * 60,
            value: 64000 + Math.random() * 500
        }));
        lineSeries.setData(data);

        setInterval(() => {
            const lastVal = data[data.length - 1].value;
            const newVal = { time: Date.now() / 1000, value: lastVal + (Math.random() - 0.5) * 50 };
            lineSeries.update(newVal);
            document.getElementById('headerPrice').innerText = `$ ${newVal.value.toFixed(2)}`;
        }, 2000);
    },
    clock() {
        setInterval(() => {
            document.getElementById('liveClock').innerText = new Date().toUTCString().split(' ')[4] + " UTC";
        }, 1000);
    },
    aiLogic() {
        const logs = document.getElementById('aiLogs');
        const msgs = ["> Monitoring dark pools...", "> Whales activity increased", "> Analyzing BTC order imbalance", "> RSI Oversold on 5m"];
        setInterval(() => {
            const p = document.createElement('p');
            p.innerText = msgs[Math.floor(Math.random()*msgs.length)];
            logs.appendChild(p);
            if(logs.childNodes.length > 10) logs.removeChild(logs.firstChild);
            logs.scrollTop = logs.scrollHeight;
        }, 4000);
    }
};
document.addEventListener('DOMContentLoaded', () => Terminal.init());
