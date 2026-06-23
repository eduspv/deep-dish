const BASE_STORAGE = import.meta.env.VITE_API_URL.replace(/\/api$/, '') + '/storage/';

/**
 * Converte imagem_url do backend para URL acessível pelo browser.
 * Aceita tanto paths relativos novos ("restaurantes/file.jpg")
 * quanto URLs absolutas legadas ("http://localhost:8000/storage/restaurantes/file.jpg").
 */
export function storageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return BASE_STORAGE + path;
}
