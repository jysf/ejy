/** Prepend Astro's base URL to a path (handles trailing/leading slashes) */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (!path.startsWith('/')) return path;
  return `${base}${path}`;
}
