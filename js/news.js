document.addEventListener("DOMContentLoaded", () => {
  const newsFeed = document.getElementById("newsFeed");
  const homeNewsFeed = document.getElementById("homeNewsFeed");
  const featuredNews = document.getElementById("featuredNews");
  const secondaryNews = document.getElementById("secondaryNews");

  const news = [
    {
      title: "Mercado reage a sinais de política monetária",
      summary:
        "Investidores acompanham movimentos de juros e recalibram expectativas para os próximos meses, em um cenário de atenção redobrada ao ambiente macro.",
      tag: "MACRO"
    },
    {
      title: "Bitcoin mantém atenção após nova onda de demanda",
      summary:
        "O mercado cripto segue no radar com fluxo forte e maior apetite por ativos digitais, mantendo Bitcoin como principal referência.",
      tag: "CRIPTO"
    },
    {
      title: "Bolsa brasileira ganha força em sessão positiva",
      summary:
        "Papéis de peso ajudam o índice local a sustentar desempenho mais consistente, com destaque para nomes de maior liquidez.",
      tag: "BOLSA"
    },
    {
      title: "Ações sensíveis a risco seguem sob observação",
      summary:
        "Operadores mantêm foco em volatilidade, rotação setorial e comportamento do capital estrangeiro diante do cenário global.",
      tag: "ESTRATÉGIA"
    },
    {
      title: "Fluxo institucional mantém ativos no radar",
      summary:
        "Setores com maior liquidez e relevância continuam recebendo atenção estratégica em carteiras mais táticas.",
      tag: "FLUXO"
    },
    {
      title: "Investidores reforçam busca por leitura de mercado",
      summary:
        "Ambiente competitivo exige ferramentas mais rápidas, visuais mais claros e plataformas com leitura mais objetiva.",
      tag: "PLATAFORMA"
    }
  ];

  if (featuredNews && news.length > 0) {
    const main = news[0];
    featuredNews.innerHTML = `
      <span class="news-meta">${main.tag}</span>
      <h2>${main.title}</h2>
      <p>${main.summary}</p>
    `;
  }

  if (secondaryNews) {
    secondaryNews.innerHTML = news
      .slice(1, 3)
      .map(
        (item) => `
        <article class="news-side-card">
          <span class="news-meta">${item.tag}</span>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
        </article>
      `
      )
      .join("");
  }

  if (newsFeed) {
    newsFeed.innerHTML = news
      .map(
        (item) => `
        <article class="news-item news-item-advanced">
          <span class="news-meta">${item.tag}</span>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
        </article>
      `
      )
      .join("");
  }

  if (homeNewsFeed) {
    homeNewsFeed.innerHTML = news
      .slice(0, 3)
      .map(
        (item) => `
        <article class="news-item">
          <span class="news-meta">${item.tag}</span>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
        </article>
      `
      )
      .join("");
  }
});
