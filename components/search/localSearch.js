'use client';

const STORAGE_KEY = 'eoa_search_index_v2';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeParse(json) {
  try { return JSON.parse(json); } catch { return null; }
}

export function readEmbeddedSearchIndex() {
  if (typeof document === 'undefined') return [];
  const el = document.getElementById('eoa-search-index');
  if (!el?.textContent) return [];
  const payload = safeParse(el.textContent);
  return Array.isArray(payload?.items) ? payload.items : [];
}

export function getLocalSearchIndex() {
  if (typeof window === 'undefined') return [];
  const embedded = readEmbeddedSearchIndex();

  try {
    const cached = safeParse(localStorage.getItem(STORAGE_KEY));
    const cachedItems = Array.isArray(cached?.items) ? cached.items : [];
    const fresh = Number(cached?.expiresAt || 0) > Date.now();

    if (embedded.length) {
      const embeddedSignature = embedded.map((item) => item.slug).join('|');
      const cachedSignature = cachedItems.map((item) => item.slug).join('|');
      if (!fresh || embeddedSignature !== cachedSignature) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          items: embedded,
          savedAt: Date.now(),
          expiresAt: Date.now() + WEEK_MS,
        }));
        return embedded;
      }
    }

    if (fresh && cachedItems.length) return cachedItems;
    if (embedded.length) return embedded;
  } catch {
    return embedded;
  }

  return [];
}

export function searchLocalTitles(query, items, limit = 8) {
  const q = normalize(query);
  if (q.length < 2) return [];

  return (Array.isArray(items) ? items : [])
    .map((item) => {
      const title = normalize(item.title);
      if (!title) return null;
      const starts = title.startsWith(q);
      const includes = title.includes(q);
      if (!starts && !includes) return null;
      return { ...item, _score: starts ? 0 : title.indexOf(q) + 10 };
    })
    .filter(Boolean)
    .sort((a, b) => a._score - b._score || String(a.title).localeCompare(String(b.title)))
    .slice(0, limit);
}
