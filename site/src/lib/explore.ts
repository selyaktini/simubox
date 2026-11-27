import { matchesEntry } from './filter';

const search = document.querySelector<HTMLInputElement>('#search');
const topic = document.querySelector<HTMLSelectElement>('#topic');
const statusFilter = document.querySelector<HTMLSelectElement>('#status-filter');
const fieldButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-field]')];
const entries = [...document.querySelectorAll<HTMLElement>('.collection-entry')];
const resultText = document.querySelector<HTMLElement>('#results');
const empty = document.querySelector<HTMLElement>('#empty');
const clear = document.querySelector<HTMLButtonElement>('#clear-filters');
const emptyReset = document.querySelector<HTMLButtonElement>('#empty-reset');

if (search && topic && statusFilter && resultText && empty && clear && emptyReset) {
  let category = 'all';

  function readUrl() {
    const params = new URLSearchParams(location.search);
    search!.value = params.get('q') || '';
    category = fieldButtons.some(button => button.dataset.field === params.get('category')) ? params.get('category')! : 'all';
    topic!.value = [...topic!.options].some(option => option.value === params.get('topic')) ? params.get('topic')! : 'all';
    statusFilter!.value = [...statusFilter!.options].some(option => option.value === params.get('status')) ? params.get('status')! : 'all';
    update(false);
  }

  function update(writeUrl: false | 'push' | 'replace') {
    const query = search!.value.trim();
    const filter = { query, category, topic: topic!.value, status: statusFilter!.value };
    let count = 0;
    for (const entry of entries) {
      const match = matchesEntry({
        category: entry.dataset.category || '',
        status: entry.dataset.status || '',
        tags: entry.dataset.tags?.split('|') || [],
        searchText: entry.dataset.search || '',
      }, filter);
      entry.hidden = !match;
      if (match) count++;
    }
    for (const button of fieldButtons) button.setAttribute('aria-pressed', String(button.dataset.field === category));
    resultText!.textContent = `${count} ${count === 1 ? 'model' : 'models'} in this view`;
    empty!.hidden = count !== 0;
    clear!.hidden = !query && category === 'all' && topic!.value === 'all' && statusFilter!.value === 'all';
    if (writeUrl) {
      const params = new URLSearchParams();
      if (query) params.set('q', search!.value.trim());
      if (category !== 'all') params.set('category', category);
      if (topic!.value !== 'all') params.set('topic', topic!.value);
      if (statusFilter!.value !== 'all') params.set('status', statusFilter!.value);
      const url = `${location.pathname}${params.size ? `?${params}` : ''}`;
      history[writeUrl === 'push' ? 'pushState' : 'replaceState'](null, '', url);
    }
  }

  function reset() {
    search!.value = '';
    topic!.value = 'all';
    statusFilter!.value = 'all';
    category = 'all';
    update('push');
    search!.focus();
  }

  for (const button of fieldButtons) button.addEventListener('click', () => { category = button.dataset.field || 'all'; update('push'); });
  search.addEventListener('input', () => update('replace'));
  topic.addEventListener('change', () => update('push'));
  statusFilter.addEventListener('change', () => update('push'));
  clear.addEventListener('click', reset);
  emptyReset.addEventListener('click', reset);
  window.addEventListener('popstate', readUrl);
  window.addEventListener('keydown', event => {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
    const target = event.target as HTMLElement;
    if (target.matches('input, textarea, select, [contenteditable="true"]')) return;
    event.preventDefault();
    search.focus();
  });
  readUrl();
}
