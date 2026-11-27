export interface FilterEntry {
  category: string;
  status: string;
  tags: string[];
  searchText: string;
}

export interface FilterState {
  query: string;
  category: string;
  topic: string;
  status: string;
}

export function matchesEntry(entry: FilterEntry, filter: FilterState): boolean {
  const query = filter.query.trim().toLocaleLowerCase();
  return (filter.category === 'all' || entry.category === filter.category)
    && (filter.topic === 'all' || entry.tags.includes(filter.topic))
    && (filter.status === 'all' || entry.status === filter.status)
    && (!query || entry.searchText.toLocaleLowerCase().includes(query));
}

export function searchTextFor(item: {
  title: string; summary: string; category: string; tags: string[]; authors: { name: string }[];
}, scientificNotes: string): string {
  return [item.title, item.summary, item.category, ...item.tags, ...item.authors.map(author => author.name), scientificNotes].join(' ');
}
