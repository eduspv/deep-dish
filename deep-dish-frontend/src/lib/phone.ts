/** Máscara (XX) XXXXX-XXXX ou (XX) XXXX-XXXX a partir só dos dígitos. */
export function formatBrazilPhone(input: string): string {
  const d = input.replace(/\D/g, '').slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  const rest = d.slice(2);
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${rest}`;
  if (d.length <= 10) {
    return `(${d.slice(0, 2)}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }
  return `(${d.slice(0, 2)}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}
