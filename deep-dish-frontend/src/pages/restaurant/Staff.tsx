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
import {
  Plus, Pencil, Trash2, Loader2, UserCheck, UserX,
  Phone, Mail, BriefcaseMedical, ChevronLeft, ChevronRight,
} from 'lucide-react';
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

const PER_PAGE = 15;

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

const isCpfValido = (cpf: string): boolean => {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digit = (slice: string, factor: number) => {
    const sum = slice.split('').reduce((acc, n, i) => acc + parseInt(n) * (factor - i), 0);
    const r = (sum * 10) % 11;
    return r >= 10 ? 0 : r;
  };
  return digit(d.slice(0, 9), 10) === parseInt(d[9]) &&
         digit(d.slice(0, 10), 11) === parseInt(d[10]);
};

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

type StatusFilter = 'all' | 'ativo' | 'inativo';

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

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [cargoFilter, setCargoFilter]   = useState('');
  const [page, setPage]                 = useState(1);
  const [lastPage, setLastPage]         = useState(1);
  const [total, setTotal]               = useState(0);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [form, setForm]             = useState<FormState>(FORM_VAZIO);

  const [confirmOpen, setConfirmOpen]     = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<StaffMember | null>(null);

  const [motivoOpen, setMotivoOpen]     = useState(false);
  const [motivoTarget, setMotivoTarget] = useState<StaffMember | null>(null);
  const [motivo, setMotivo]             = useState('');

  const emailInvalid  = form.email.trim() !== '' && !isEmailValido(form.email);
  const cargoFinal    = form.cargo === 'outro' ? form.cargoCustom.trim() : form.cargo;
  const cpfValido     = form.cpf.length === 14 && isCpfValido(form.cpf);
  const horasSaida    = form.horaEntrada
    ? HORAS.slice(HORAS.indexOf(form.horaEntrada) + 1)
    : HORAS;
  const turnoCompleto = !!(form.dias && form.horaEntrada && form.horaSaida);
  const canSave =
    !!form.name.trim() &&
    !!cargoFinal &&
    cpfValido &&
    !!form.data_nascimento &&
    form.telefone.length >= 14 &&
    turnoCompleto &&
    !emailInvalid;

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const result = await staffService.list({
        page,
        per_page: PER_PAGE,
        status: statusFilter === 'all' ? undefined : statusFilter,
        cargo: cargoFilter || undefined,
      });
      setStaff(result.data);
      setLastPage(result.last_page);
      setTotal(result.total);
    } catch {
      toast.error('Erro ao carregar equipe.');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, cargoFilter]);

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
        await staffService.create(payload);
        toast.success('Funcionário adicionado.');
        fetchStaff();
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
      setMotivoTarget(s);
      setMotivo('');
      setMotivoOpen(true);
    } else {
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
      toast.success('Funcionário removido.');
      setConfirmOpen(false);
      setConfirmTarget(null);
      // Go to prev page if last item on page > 1
      const newPage = staff.length === 1 && page > 1 ? page - 1 : page;
      if (newPage !== page) {
        setPage(newPage);
      } else {
        fetchStaff();
      }
    } catch {
      toast.error('Erro ao remover funcionário.');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Filtros ───────────────────────────────────────────────────────────────

  const changeStatus = (s: StatusFilter) => {
    setStatusFilter(s);
    setPage(1);
  };

  const changeCargo = (v: string) => {
    setCargoFilter(v === 'all' ? '' : v);
    setPage(1);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Equipe</h1>
        <Button size="sm" className="min-h-[36px]" onClick={openAdd}>
          <Plus className="mr-1.5 h-4 w-4" /> Adicionar
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-border overflow-hidden text-sm">
          {(['all', 'ativo', 'inativo'] as const).map((s, i) => (
            <button
              key={s}
              onClick={() => changeStatus(s)}
              className={`px-3 py-1.5 transition-colors duration-150 ${
                i > 0 ? 'border-l border-border' : ''
              } ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              {s === 'all' ? 'Todos' : s === 'ativo' ? 'Ativos' : 'Inativos'}
            </button>
          ))}
        </div>

        <Select value={cargoFilter || 'all'} onValueChange={changeCargo}>
          <SelectTrigger className="w-48 h-9 text-sm">
            <SelectValue placeholder="Cargo..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os cargos</SelectItem>
            {CARGOS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        {total > 0 && (
          <span className="ml-auto text-sm text-muted-foreground">
            {total} {total === 1 ? 'funcionário' : 'funcionários'}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      ) : staff.length === 0 ? (
        <EmptyState
          icon={<UserCheck className="h-7 w-7" />}
          title="Nenhum funcionário encontrado"
          description={
            statusFilter !== 'all' || cargoFilter
              ? 'Tente ajustar os filtros.'
              : 'Adicione os membros da sua equipe para gerenciá-los aqui.'
          }
          action={
            statusFilter === 'all' && !cargoFilter
              ? <Button onClick={openAdd}>Adicionar funcionário</Button>
              : undefined
          }
        />
      ) : (
        <>
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

          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-3 pt-1">
              <Button
                variant="ghost" size="sm" className="h-8 w-8 p-0"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {lastPage}
              </span>
              <Button
                variant="ghost" size="sm" className="h-8 w-8 p-0"
                disabled={page >= lastPage}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Dialog: adicionar / editar */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) closeDialog(); }}>
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
                    className={form.cpf.length === 14 && !cpfValido ? 'border-destructive focus-visible:ring-destructive' : ''}
                  />
                  {form.cpf.length === 14 && !cpfValido && (
                    <p className="text-xs text-destructive">CPF inválido</p>
                  )}
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
      <Dialog open={motivoOpen} onOpenChange={(open) => { if (!open) { setMotivoOpen(false); setMotivoTarget(null); setMotivo(''); } }}>
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