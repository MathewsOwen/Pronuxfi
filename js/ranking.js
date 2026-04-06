// ===============================
// RANKING - PRONUXFIN
// ===============================

let RANKING_STATE = {
  all: [],
  filtered: []
};

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const tableContainer = document.querySelector('#ranking-table');
  const filterInput = document.querySelector('#ranking-filter-input');
  const refreshButton = document.querySelector('#ranking-refresh-btn');

  if (!tableContainer || !window.api) {
    return;
  }

  loadRanking(tableContainer);

  if (filterInput) {
    filterInput.addEventListener('input', () => {
      applyRankingFilter(filterInput.value, tableContainer);
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      loadRanking(tableContainer, true);
    });
  }
});

// ===============================
// CARREGAR RANKING
// ===============================
async function loadRanking(container, forceReload = false) {
  try {
    setLoading(container, 'Atualizando ranking...');

    const response = await window.api.getRanking(50);
    const rows = response.items || response.data || [];

    if (!Array.isArray(rows) || rows.length === 0) {
      setEmpty(container, 'Nenhum ranking disponível.');
      return;
    }

    RANKING_STATE.all = rows;
    RANKING_STATE.filtered = rows;

    renderRankingTable(container, rows);
  } catch (error) {
    console.error('[RANKING ERROR]', error);
    setError(container, 'Erro ao carregar ranking.');
  }
}

// ===============================
// FILTRO
// ===============================
function applyRankingFilter(term, container) {
  const value = term.toLowerCase().trim();

  if (!value) {
    RANKING_STATE.filtered = RANKING_STATE.all;
  } else {
    RANKING_STATE.filtered = RANKING_STATE.all.filter((item) => {
      const symbol = (item.symbol || '').toLowerCase();
      const name = (item.name || '').toLowerCase();
      const type = (item.type || '').toLowerCase();

      return (
        symbol.includes(value) ||
        name.includes(value) ||
        type.includes(value)
      );
    });
  }

  renderRankingTable(container, RANKING_STATE.filtered);
}

// ===============================
// RENDER TABELA
// ===============================
function renderRankingTable(container, rows) {
  renderTable(
    container,
    [
      {
        label: '#',
        key: 'rank',
        render: (_, index) => `<strong>${index + 1}</strong>`
      },
      {
        label: 'Ativo',
        key: 'symbol',
        render: (row) => createAssetRowLink(row.symbol, row.type || 'stock')
      },
      {
        label: 'Nome',
        key: 'name',
        render: (row) => row.name || '--'
      },
      {
        label: 'Tipo',
        key: 'type',
        render: (row) => `<span class="badge">${(row.type || 'ativo').toUpperCase()}</span>`
      },
      {
        label: 'Preço',
        key: 'price',
        render: (row) => {
          const currency = row.currency || 'USD';
          return formatCurrency(row.price, currency);
        }
      },
      {
        label: 'Variação',
        key: 'changePercent',
        render: (row) => formatDeltaHTML(row.changePercent)
      }
    ],
    rows
  );
}
