import { httpClient } from './httpClient';
import { Cliente, Restaurante } from '@/types';

interface LoginResponse {
  token: string;
  type: 'cliente' | 'restaurante';
}

interface RegisterClienteResponse {
  token: string;
  type: 'cliente';
  cliente: Cliente;
}

interface RegisterRestauranteResponse {
  token: string;
  type: 'restaurante';
  restaurante: Restaurante;
}

export const authService = {

  // ─── CLIENTE ────────────────────────────────────────────

  async loginCliente(email: string, password: string): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>('/cliente/login', { email, password });
  },

  async registerCliente(
    name: string,
    email: string,
    cpf: string,
    password: string
  ): Promise<RegisterClienteResponse> {
    return httpClient.post<RegisterClienteResponse>('/cliente/register', {
      name, email, cpf, password,
    });
  },

  async getMeCliente(): Promise<Cliente> {
    return httpClient.get<Cliente>('/cliente/me');
  },

  async logoutCliente(): Promise<void> {
    return httpClient.post('/cliente/logout');
  },

  // ─── RESTAURANTE ────────────────────────────────────────

  async loginRestaurante(email: string, password: string): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>('/restaurante/login', { email, password });
  },

  async registerRestaurante(data: {
    name: string;
    email: string;
    password: string;
    cnpj: string;
    tipo: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  }): Promise<RegisterRestauranteResponse> {
    return httpClient.post<RegisterRestauranteResponse>('/restaurante/register', data);
  },

  async getMeRestaurante(): Promise<Restaurante> {
    return httpClient.get<Restaurante>('/restaurante/me');
  },

  async logoutRestaurante(): Promise<void> {
    return httpClient.post('/restaurante/logout');
  },

  // ─── Atualiza perfil do restaurante ─────────────────────
  async updateRestaurante(data: Partial<Restaurante>): Promise<Restaurante> {
    return httpClient.put<Restaurante>('/restaurante/me', data);
  },

  // ─── Upload de imagem do restaurante ────────────────────
  async uploadImagemRestaurante(file: File): Promise<{ imagem_url: string }> {
    const token = localStorage.getItem('jwt');
    const formData = new FormData();
    formData.append('imagem', file);

    // ⚠️ NÃO passa Content-Type — o browser define sozinho com o boundary
    const res = await fetch(`${import.meta.env.VITE_API_URL}/restaurante/me/imagem`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || 'Erro ao fazer upload da imagem.');
    return data;
  },
};