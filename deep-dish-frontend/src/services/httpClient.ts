import { getAuthHeaders } from './api';

const BASE = import.meta.env.VITE_API_URL;

// Erro customizado que carrega o status HTTP e a mensagem do backend
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Processa a resposta — extrai JSON e lança erro se não foi ok
async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // tenta pegar a mensagem de erro do backend
    const message =
      data?.message ||
      data?.error ||
      `Erro ${res.status}`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}

export const httpClient = {
  // GET — buscar dados
  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<T>(res);
  },

  // POST — criar ou autenticar
  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  // PUT — atualizar
  async put<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  // DELETE — remover
  async delete<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<T>(res);
  },
};