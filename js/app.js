async function loadDashboard() {
  try {
    const response = await fetch("https://SEU-BACKEND/api/dashboard");
    const data = await response.json();

    renderCrypto(data.marketSummary.crypto);
    renderStocks(data.marketSummary.stocks);

  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
  }
}
