import { StaffMember, Paginated } from '@/types';
import { httpClient } from './httpClient';

interface StaffPayload {
  name: string;
  cargo: string;
  cpf?: string | null;
  telefone?: string | null;
  email?: string | null;
  data_nascimento?: string | null;
  horario?: string | null;
  observacoes?: string | null;
  ativo?: boolean;
  motivo_afastamento?: string | null;
}

interface StaffListParams {
  page?: number;
  per_page?: number;
  status?: 'ativo' | 'inativo';
  cargo?: string;
}

export const staffService = {
  async list(params?: StaffListParams): Promise<Paginated<StaffMember>> {
    const q = new URLSearchParams();
    if (params?.page)     q.set('page',     String(params.page));
    if (params?.per_page) q.set('per_page', String(params.per_page));
    if (params?.status)   q.set('status',   params.status);
    if (params?.cargo)    q.set('cargo',    params.cargo);
    const path = q.toString() ? `/restaurante/funcionarios?${q}` : '/restaurante/funcionarios';
    return httpClient.get(path);
  },

  async create(payload: StaffPayload): Promise<StaffMember> {
    return httpClient.post('/restaurante/funcionarios', payload);
  },

  async update(id: string, payload: Partial<StaffPayload>): Promise<StaffMember> {
    return httpClient.put(`/restaurante/funcionarios/${id}`, payload);
  },

  async remove(id: string): Promise<void> {
    return httpClient.delete(`/restaurante/funcionarios/${id}`);
  },
};