import { getAuthHeaders } from './api';

const BASE = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const traducoes: Record<string, string> = {
  // ─── Campos obrigatórios ────────────────────────────────
  'The name field is required.'                : 'O nome é obrigatório.',
  'The email field is required.'               : 'O e-mail é obrigatório.',
  'The password field is required.'            : 'A senha é obrigatória.',
  'The cpf field is required.'                 : 'O CPF é obrigatório.',
  'The cnpj field is required.'                : 'O CNPJ é obrigatório.',
  'The tipo field is required.'                : 'O tipo de restaurante é obrigatório.',
  'The logradouro field is required.'          : 'O logradouro é obrigatório.',
  'The numero field is required.'              : 'O número é obrigatório.',
  'The bairro field is required.'              : 'O bairro é obrigatório.',
  'The cidade field is required.'              : 'A cidade é obrigatória.',
  'The estado field is required.'              : 'O estado é obrigatório.',
  'The cep field is required.'                 : 'O CEP é obrigatório.',

  // ─── Tamanho/formato ────────────────────────────────────
  'The password field must be at least 6 characters.' : 'A senha deve ter pelo menos 6 caracteres.',
  'The estado field must be 2 characters.'            : 'O estado deve ter 2 caracteres. Ex: SP.',
  'The name field must not be greater than 255 characters.' : 'O nome deve ter no máximo 255 caracteres.',
  'The cep field format is invalid.'                  : 'O CEP é inválido. Use o formato 00000-000.',
  'The email field must be a valid email address.'    : 'O e-mail informado é inválido.',

  // ─── Unicidade ──────────────────────────────────────────
  'The email has already been taken.'  : 'Este e-mail já está cadastrado.',
  'The cpf has already been taken.'    : 'Este CPF já está cadastrado.',
  'The cnpj has already been taken.'   : 'Este CNPJ já está cadastrado.',

  // ─── Tipo inválido ──────────────────────────────────────
  'The selected tipo is invalid.'      : 'O tipo de restaurante selecionado é inválido.',

  // ─── Autenticação ───────────────────────────────────────
  'These credentials do not match our records.' : 'Email ou senha inválidos.',
  'The given data was invalid.'                 : 'Dados inválidos.',
  'Token inválido, faça login novamente.'       : 'Sessão expirada. Faça login novamente.',
  'Email ou senha inválidos'                    : 'Email ou senha inválidos.',

  // ─── Erros gerais ───────────────────────────────────────
  'Erro interno no servidor' : 'Erro interno no servidor. Tente novamente.',
  'Server Error'             : 'Erro interno no servidor. Tente novamente.',
  'Unauthenticated.'         : 'Sessão expirada. Faça login novamente.',
};

function traduzir(msg: string): string {
  return traducoes[msg] ?? msg;
}

function extrairMensagem(data: Record<string, unknown>, status: number): string {
  if (status === 422 && data?.details && typeof data.details === 'object') {
    const firstField = Object.values(data.details as Record<string, string[]>)
      .flat()
      .find((msg): msg is string => typeof msg === 'string');

    if (firstField) return traduzir(firstField);
  }

  const msg = (data?.message || data?.error) as string | undefined;
  return msg ? traduzir(msg) : `Erro ${status}`;
}

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshToken(): Promise<string | null> {
  const userType = localStorage.getItem('userType');
  const endpoint = userType === 'restaurante' ? '/restaurante/refresh' : '/cliente/refresh';

  try {
    const res = await fetch(`${BASE}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data?.token) {
      localStorage.setItem('jwt', data.token);
      return data.token;
    }
    return null;
  } catch {
    return null;
  }
}

async function refreshOnce(): Promise<string | null> {
  if (isRefreshing) return refreshPromise;
  isRefreshing = true;
  refreshPromise = tryRefreshToken().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });
  return refreshPromise;
}

async function fetchWithRefresh(path: string, init: RequestInit): Promise<Response> {
  const res = await fetch(`${BASE}${path}`, init);

  if (res.status === 401 && localStorage.getItem('jwt')) {
    const newToken = await refreshOnce();
    if (newToken) {
      const retryHeaders = { ...init.headers, Authorization: `Bearer ${newToken}` } as HeadersInit;
      return fetch(`${BASE}${path}`, { ...init, headers: retryHeaders });
    }
  }

  return res;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, extrairMensagem(data, res.status));
  }

  return data as T;
}

export const httpClient = {
  async get<T>(path: string): Promise<T> {
    const res = await fetchWithRefresh(path, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return handleResponse<T>(res);
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetchWithRefresh(path, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async put<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetchWithRefresh(path, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async patch<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetchWithRefresh(path, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async delete<T>(path: string): Promise<T> {
    const res = await fetchWithRefresh(path, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<T>(res);
  },
};