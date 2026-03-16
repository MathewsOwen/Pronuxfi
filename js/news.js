document.addEventListener("DOMContentLoaded", () => {
  const newsFeed = document.getElementById("newsFeed");
  const homeNewsFeed = document.getElementById("homeNewsFeed");

  const news = [
    {
      title: "Mercado reage a sinais de política monetária",
      summary:
        "Investidores acompanham movimentos de juros e recalibram expectativas para os próximos meses.",
      tag: "MACRO"
    },
    {
      title: "Bitcoin mantém atenção após nova onda de demanda",
      summary:
        "O mercado cripto segue no radar com fluxo forte e maior apetite por ativos digitais.",
      tag: "CRIPTO"
    },
    {
      title: "Bolsa brasileira ganha força em sessão positiva",
      summary:
        "Papéis de peso ajudam o índice local a sustentar desempenho mais consistente.",
      tag: "BOLSA"
    },
    {
      title: "Ações sensíveis a risco seguem sob observação",
      summary:
        "Operadores mantêm foco em volatilidade, rotação setorial e comportamento do capital estrangeiro.",
      tag: "ESTRATÉGIA"
    },
    {
      title: "Fluxo institucional mantém ativos no radar",
      summary:
        "Setores com maior liquidez e relevância continuam recebendo atenção estratégica.",
      tag: "FLUXO"
    },
    {
      title: "Investidores reforçam busca por leitura de mercado",
      summary:
        "Ambiente competitivo exige ferramentas mais rápidas e plataformas visuais mais objetivas.",
      tag: "PLATAFORMA"
    }
  ];

  const renderCards = (list) =>
    list
      .map((item) => `
        <article class="news-item">
          <span class="news-meta">${item.tag}</span>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
        </article>
      `)
      .join("");

  if (newsFeed) {
    newsFeed.innerHTML = renderCards(news);
  }

  if (homeNewsFeed) {
    homeNewsFeed.innerHTML = renderCards(news.slice(0, 3));
  }
});
