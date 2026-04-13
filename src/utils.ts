const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function asset(path: string): string {
  if (!path.startsWith('/')) return path;
  return `${base}${path}`;
}
