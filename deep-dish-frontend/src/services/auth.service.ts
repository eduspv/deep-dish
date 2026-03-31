import { httpClient } from './httpClient';
import { Cliente, Restaurante } from '@/types';

// Tipos de resposta da API
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

  // Faz login do cliente → recebe token
  async loginCliente(email: string, password: string): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>('/cliente/login', { email, password });
  },

  // Cadastra novo cliente → recebe token + dados
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

  // Busca dados do cliente logado
  async getMeCliente(): Promise<Cliente> {
    return httpClient.get<Cliente>('/cliente/me');
  },

  // Desloga o cliente
  async logoutCliente(): Promise<void> {
    return httpClient.post('/cliente/logout');
  },

  // ─── RESTAURANTE ────────────────────────────────────────

  // Faz login do restaurante → recebe token
  async loginRestaurante(email: string, password: string): Promise<LoginResponse> {
    return httpClient.post<LoginResponse>('/restaurante/login', { email, password });
  },

  // Cadastra novo restaurante → recebe token + dados
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

  // Busca dados do restaurante logado
  async getMeRestaurante(): Promise<Restaurante> {
    return httpClient.get<Restaurante>('/restaurante/me');
  },

  // Desloga o restaurante
  async logoutRestaurante(): Promise<void> {
    return httpClient.post('/restaurante/logout');
  },
};