// ===============================
// CALENDÁRIO ECONÔMICO - PRONUXFIN
// ===============================

let CALENDAR_STATE = {
  all: [],
  filtered: []
};

// ===============================
// INIT
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.querySelector('#calendar-grid');
  const filterInput = document.querySelector('#calendar-filter-input');
  const refreshButton = document.querySelector('#calendar-refresh-btn');

  if (!gridContainer || !window.api) {
    return;
  }

  loadCalendar(gridContainer);

  if (filterInput) {
    filterInput.addEventListener('input', () => {
      applyCalendarFilter(filterInput.value, gridContainer);
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      loadCalendar(gridContainer, true);
    });
  }
});

// ===============================
// CARREGAR CALENDÁRIO
// ===============================
async function loadCalendar(container, forceReload = false) {
  try {
    container.innerHTML = '<div class="loading">Atualizando calendário econômico...</div>';

    const response = await window.api.getCalendar('BR', 30);
    const items = response.items || response.data || [];

    if (!Array.isArray(items) || items.length === 0) {
      setEmpty(container, 'Nenhum evento econômico encontrado.');
      return;
    }

    CALENDAR_STATE.all = items;
    CALENDAR_STATE.filtered = items;

    renderCalendar(container, items);
  } catch (error) {
    console.error('[CALENDAR ERROR]', error);
    setError(container, 'Erro ao carregar calendário econômico.');
  }
}

// ===============================
// FILTRO
// ===============================
function applyCalendarFilter(term, container) {
  const value = term.toLowerCase().trim();

  if (!value) {
    CALENDAR_STATE.filtered = CALENDAR_STATE.all;
  } else {
    CALENDAR_STATE.filtered = CALENDAR_STATE.all.filter((item) => {
      const title = (item.title || item.event || '').toLowerCase();
      const country = (item.country || '').toLowerCase();
      const impact = (item.impact || '').toLowerCase();

      return (
        title.includes(value) ||
        country.includes(value) ||
        impact.includes(value)
      );
    });
  }

  renderCalendar(container, CALENDAR_STATE.filtered);
}

// ===============================
// RENDER CALENDÁRIO
// ===============================
function renderCalendar(container, items) {
  if (!Array.isArray(items) || items.length === 0) {
    setEmpty(container, 'Nenhum evento encontrado para esse filtro.');
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const title = item.title || item.event || 'Evento econômico';
      const date = item.date || item.time || '--';
      const country = item.country || 'Global';
      const impact = item.impact || 'Moderado';

      const actual = item.actual ? `Atual: ${item.actual}` : '';
      const forecast = item.forecast ? ` • Projeção: ${item.forecast}` : '';
      const previous = item.previous ? ` • Anterior: ${item.previous}` : '';

      return `
        <div class="event-item">
          <small>${date} • ${country}</small>
          <strong>${title}</strong>
          <span class="card-subtitle">
            ${actual}${forecast}${previous}
          </span>
          <span class="delta ${getImpactClass(impact)}">
            Impacto: ${impact}
          </span>
        </div>
      `;
    })
    .join('');
}

// ===============================
// IMPACTO VISUAL
// ===============================
function getImpactClass(impact) {
  const normalized = String(impact || '').toLowerCase();

  if (normalized.includes('alto')) return 'up';
  if (normalized.includes('baixo')) return 'flat';

  return 'down';
}
