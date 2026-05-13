import { StaffMember } from '@/types';
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

export const staffService = {
  async list(): Promise<StaffMember[]> {
    return httpClient.get('/restaurante/funcionarios');
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