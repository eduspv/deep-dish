import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { staffService } from '@/services/staff.service';
import { StaffMember } from '@/types';
import { Plus, Pencil, Trash2, Loader2, UserCheck, UserX, Phone, Mail, BriefcaseMedical } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '@/components/EmptyState';
import ConfirmModal from '@/components/ConfirmModal';

// ── Constantes ────────────────────────────────────────────────────────────────

const CARGOS = [
  'Garçom',
  'Garçonete',
  'Chef de Cozinha',
  'Sous Chef',
  'Cozinheiro(a)',
  'Auxiliar de Cozinha',
  'Hostess / Recepcionista',
  'Caixa',
  'Gerente',
  'Barista',
  'Bartender',
  'Auxiliar de Limpeza',
  'Entregador(a)',
];

const DIAS_SEMANA = [
  'Seg–Sex',
  'Seg–Sáb',
  'Seg–Dom',
  'Ter–Sáb',
  'Qua–Dom',
  'Finais de semana',
  'Todos os dias',
];

const HORAS = Array.from({ length: 22 }, (_, i) => {
  const h = (5 + i) % 24;
  return `${String(h).padStart(2, '0')}:00`;
});

// ── Máscaras ──────────────────────────────────────────────────────────────────

const maskCPF = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const maskTelefone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
};

const isEmailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ── Helpers ───────────────────────────────────────────────────────────────────

const nullIfEmpty = (v: string) => v.trim() || null;

const cargoParaSelect = (cargo: string) =>
  CARGOS.includes(cargo) ? cargo : 'outro';

const parseHorario = (h: string | null | undefined) => {
  if (!h) return { dias: '', horaEntrada: '', horaSaida: '' };
  const m = h.match(/^(.+) · (\d{2}:\d{2})–(\d{2}:\d{2})$/);
  if (m) return { dias: m[1], horaEntrada: m[2], horaSaida: m[3] };
  return { dias: '', horaEntrada: '', horaSaida: '' };
};

const buildHorario = (dias: string, entrada: string, saida: string) =>
  dias && entrada && saida ? `${dias} · ${entrada}–${saida}` : null;

// ── Tipos ─────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  cargo: string;
  cargoCustom: string;
  cpf: string;
  telefone: string;
  email: string;
  data_nascimento: string;
  dias: string;
  horaEntrada: string;
  horaSaida: string;
  observacoes: string;
}

const FORM_VAZIO: FormState = {
  name: '',
  cargo: '',
  cargoCustom: '',
  cpf: '',
  telefone: '',
  email: '',
  data_nascimento: '',
  dias: '',
  horaEntrada: '',
  horaSaida: '',
  observacoes: '',
};

// ── Componente ────────────────────────────────────────────────────────────────

const Staff: React.FC = () => {
  const [staff, setStaff]           = useState<StaffMember[]>([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen]   = useState(false);
  const [editTarget, setEditTarget]   = useState<StaffMember | null>(null);
  const [form, setForm]               = useState<FormState>(FORM_VAZIO);

  const [confirmOpen, setConfirmOpen]     = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<StaffMember | null>(null);

  const [motivoOpen, setMotivoOpen]       = useState(false);
  const [motivoTarget, setMotivoTarget]   = useState<StaffMember | null>(null);
  const [motivo, setMotivo]               = useState('');

  const emailInvalid  = form.email.trim() !== '' && !isEmailValido(form.email);
  const cargoFinal    = form.cargo === 'outro' ? form.cargoCustom.trim() : form.cargo;
  const horasSaida    = form.horaEntrada
    ? HORAS.slice(HORAS.indexOf(form.horaEntrada) + 1)
    : HORAS;
  const turnoCompleto = !!(form.dias && form.horaEntrada && form.horaSaida);
  const canSave =
    !!form.name.trim() &&
    !!cargoFinal &&
    form.cpf.length === 14 &&
    !!form.data_nascimento &&
    form.telefone.length >= 14 &&
    turnoCompleto &&
    !emailInvalid;

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      setStaff(await staffService.list());
    } catch {
      toast.error('Erro ao carregar equipe.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  // ── Dialog ────────────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditTarget(null);
    setForm(FORM_VAZIO);
    setDialogOpen(true);
  };

  const openEdit = (s: StaffMember) => {
    setEditTarget(s);
    const cargoSel  = cargoParaSelect(s.cargo);
    const { dias, horaEntrada, horaSaida } = parseHorario(s.horario);
    setForm({
      name:            s.name,
      cargo:           cargoSel,
      cargoCustom:     cargoSel === 'outro' ? s.cargo : '',
      cpf:             s.cpf             ?? '',
      telefone:        s.telefone        ?? '',
      email:           s.email           ?? '',
      data_nascimento: s.data_nascimento ?? '',
      dias,
      horaEntrada,
      horaSaida,
      observacoes:     s.observacoes     ?? '',
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditTarget(null);
    setForm(FORM_VAZIO);
  };

  // ── Salvar ────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const payload = {
        name:            form.name.trim(),
        cargo:           cargoFinal,
        cpf:             nullIfEmpty(form.cpf),
        telefone:        nullIfEmpty(form.telefone),
        email:           nullIfEmpty(form.email),
        data_nascimento: nullIfEmpty(form.data_nascimento),
        horario:         buildHorario(form.dias, form.horaEntrada, form.horaSaida),
        observacoes:     nullIfEmpty(form.observacoes),
      };
      if (editTarget) {
        const updated = await staffService.update(editTarget.id, payload);
        setStaff(prev => prev.map(s => s.id === updated.id ? updated : s));
        toast.success('Funcionário atualizado.');
      } else {
        const created = await staffService.create(payload);
        setStaff(prev => [...prev, created]);
        toast.success('Funcionário adicionado.');
      }
      closeDialog();
    } catch {
      toast.error('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle ativo ──────────────────────────────────────────────────────────

  const handleToggleAtivo = (s: StaffMember) => {
    if (s.ativo) {
      // Desativar → pede motivo
      setMotivoTarget(s);
      setMotivo('');
      setMotivoOpen(true);
    } else {
      // Reativar → direto, sem motivo
      handleReativar(s);
    }
  };

  const handleReativar = async (s: StaffMember) => {
    setTogglingId(s.id);
    try {
      const updated = await staffService.update(s.id, { ativo: true, motivo_afastamento: null });
      setStaff(prev => prev.map(m => m.id === updated.id ? updated : m));
      toast.success(`${updated.name} reativado.`);
    } catch {
      toast.error('Erro ao atualizar status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmarAfastamento = async () => {
    if (!motivoTarget || !motivo) return;
    setTogglingId(motivoTarget.id);
    setMotivoOpen(false);
    try {
      const updated = await staffService.update(motivoTarget.id, {
        ativo: false,
        motivo_afastamento: motivo,
      });
      setStaff(prev => prev.map(m => m.id === updated.id ? updated : m));
      toast.success(`${updated.name} afastado — ${motivo}.`);
    } catch {
      toast.error('Erro ao atualizar status.');
    } finally {
      setTogglingId(null);
      setMotivoTarget(null);
      setMotivo('');
    }
  };

  // ── Excluir ───────────────────────────────────────────────────────────────

  const openDelete = (s: StaffMember) => {
    setConfirmTarget(s);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!confirmTarget) return;
    setDeletingId(confirmTarget.id);
    try {
      await staffService.remove(confirmTarget.id);
      setStaff(prev => prev.filter(s => s.id !== confirmTarget.id));
      toast.success('Funcionário removido.');
      setConfirmOpen(false);
      setConfirmTarget(null);
    } catch {
      toast.error('Erro ao remover funcionário.');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Equipe</h1>
        <Button size="sm" className="min-h-[36px]" onClick={openAdd}>
          <Plus className="mr-1.5 h-4 w-4" /> Adicionar
        </Button>
      </div>

      {staff.length === 0 ? (
        <EmptyState
          icon={<UserCheck className="h-7 w-7" />}
          title="Nenhum funcionário cadastrado"
          description="Adicione os membros da sua equipe para gerenciá-los aqui."
          action={<Button onClick={openAdd}>Adicionar funcionário</Button>}
        />
      ) : (
        <div className="space-y-2.5 animate-stagger">
          {staff.map(s => (
            <div
              key={s.id}
              className={`rounded-2xl bg-card p-4 shadow-card flex items-center justify-between gap-3 transition-all duration-200 hover:shadow-card-hover ${!s.ativo ? 'opacity-60' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{s.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {s.cargo}
                  {s.horario && <span className="ml-2">· {s.horario}</span>}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                  {s.telefone && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />{s.telefone}
                    </span>
                  )}
                  {s.email && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />{s.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  s.ativo
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${s.ativo ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {s.ativo ? 'Ativo' : (s.motivo_afastamento ?? 'Inativo')}
                </span>

                <Button size="sm" variant="ghost" className="h-8 w-8 p-0"
                  title={s.ativo ? 'Desativar' : 'Ativar'}
                  disabled={togglingId === s.id}
                  onClick={() => handleToggleAtivo(s)}
                >
                  {togglingId === s.id
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : s.ativo
                      ? <UserX className="h-4 w-4 text-muted-foreground" />
                      : <UserCheck className="h-4 w-4 text-muted-foreground" />
                  }
                </Button>

                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Editar" onClick={() => openEdit(s)}>
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>

                <Button size="sm" variant="ghost"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Remover" onClick={() => openDelete(s)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog: adicionar / editar */}
      <Dialog open={dialogOpen} onOpenChange={() => {}}>

        <DialogContent
          className="bg-card rounded-2xl max-w-lg max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={e => e.preventDefault()}
          onEscapeKeyDown={e => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="font-display">
              {editTarget ? 'Editar funcionário' : 'Novo funcionário'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">

            {/* Identificação */}
            <section className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Identificação</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label>Nome completo <span className="text-destructive">*</span></Label>
                  <Input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ex.: João Silva"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>CPF <span className="text-destructive">*</span></Label>
                  <Input
                    value={form.cpf}
                    onChange={e => setForm(f => ({ ...f, cpf: maskCPF(e.target.value) }))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    inputMode="numeric"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Data de nascimento <span className="text-destructive">*</span></Label>
                  <Input
                    type="date"
                    value={form.data_nascimento}
                    onChange={e => setForm(f => ({ ...f, data_nascimento: e.target.value }))}
                  />
                </div>
              </div>
            </section>

            {/* Contato */}
            <section className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contato</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Telefone <span className="text-destructive">*</span></Label>
                  <Input
                    value={form.telefone}
                    onChange={e => setForm(f => ({ ...f, telefone: maskTelefone(e.target.value) }))}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    inputMode="numeric"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="joao@exemplo.com"
                    className={emailInvalid ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {emailInvalid && (
                    <p className="text-xs text-destructive">E-mail inválido</p>
                  )}
                </div>
              </div>
            </section>

            {/* Cargo e jornada */}
            <section className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cargo e jornada</p>
              <div className="space-y-3">

                {/* Cargo */}
                <div className="space-y-1.5">
                  <Label>Cargo / Função <span className="text-destructive">*</span></Label>
                  <Select
                    value={form.cargo}
                    onValueChange={v => setForm(f => ({ ...f, cargo: v, cargoCustom: '' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CARGOS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.cargo === 'outro' && (
                    <Input
                      value={form.cargoCustom}
                      onChange={e => setForm(f => ({ ...f, cargoCustom: e.target.value }))}
                      placeholder="Descreva o cargo..."
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Turno */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-3 space-y-1.5">
                    <Label>Dias da semana <span className="text-destructive">*</span></Label>
                    <Select
                      value={form.dias}
                      onValueChange={v => setForm(f => ({ ...f, dias: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {DIAS_SEMANA.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3 grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Entrada <span className="text-destructive">*</span></Label>
                      <Select
                        value={form.horaEntrada}
                        onValueChange={v => setForm(f => ({
                          ...f,
                          horaEntrada: v,
                          horaSaida: f.horaSaida && HORAS.indexOf(f.horaSaida) <= HORAS.indexOf(v)
                            ? ''
                            : f.horaSaida,
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="00:00" />
                        </SelectTrigger>
                        <SelectContent>
                          {HORAS.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Saída <span className="text-destructive">*</span></Label>
                      <Select
                        value={form.horaSaida}
                        onValueChange={v => setForm(f => ({ ...f, horaSaida: v }))}
                        disabled={!form.horaEntrada}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={form.horaEntrada ? '00:00' : '— selecione entrada —'} />
                        </SelectTrigger>
                        <SelectContent>
                          {horasSaida.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Observações */}
            <section className="space-y-1.5">
              <Label>Observações <span className="text-muted-foreground text-xs">(opcional)</span></Label>
              <Textarea
                value={form.observacoes}
                onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                placeholder="Anotações adicionais sobre o funcionário..."
                rows={3}
                className="resize-none"
              />
            </section>

          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving || !canSave} className="min-h-[40px]">
              {saving
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
                : editTarget ? 'Salvar alterações' : 'Adicionar'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de motivo de afastamento */}
      <Dialog open={motivoOpen} onOpenChange={() => {}}>
        <DialogContent
          className="bg-card rounded-2xl max-w-sm"
          onPointerDownOutside={e => e.preventDefault()}
          onEscapeKeyDown={e => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <BriefcaseMedical className="h-5 w-5 text-amber-500" />
              Motivo do afastamento
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2 py-2">
            {['Férias', 'Licença médica', 'Licença maternidade/paternidade', 'Afastamento temporário'].map(op => (
              <button
                key={op}
                onClick={() => setMotivo(op)}
                className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm transition-all duration-150 ${
                  motivo === op
                    ? 'border-primary bg-primary/10 font-medium text-primary'
                    : 'border-border hover:border-primary/40 hover:bg-muted/50'
                }`}
              >
                {op}
              </button>
            ))}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setMotivoOpen(false); setMotivoTarget(null); setMotivo(''); }}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmarAfastamento} disabled={!motivo}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmação de exclusão */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setConfirmTarget(null); }}
        onConfirm={handleDelete}
        title="Remover funcionário?"
        description={`${confirmTarget?.name} será removido permanentemente da equipe.`}
        confirmLabel="Remover"
        isLoading={!!deletingId}
      />
    </div>
  );
};

export default Staff;