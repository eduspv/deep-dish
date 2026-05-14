import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TimePicker } from '@/components/ui/time-picker';
import { useAuth } from '@/contexts/AuthContext';
import { Restaurante } from '@/types';
import { toast } from 'sonner';
import { Camera, Loader2 } from 'lucide-react';
import { formatBrazilPhone } from '@/lib/phone';

const Settings: React.FC = () => {
  const { user, updateRestaurant, uploadImagemRestaurant } = useAuth();
  const restaurante = user as Restaurante;

  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(restaurante?.name ?? '');
  const [telefone, setTelefone] = useState(() =>
    formatBrazilPhone(restaurante?.telefone ?? '')
  );
  const [horarioAbertura, setHorarioAbertura] = useState(
    (restaurante?.horario_abertura ?? '').slice(0, 5)
  );
  const [horarioFechamento, setHorarioFechamento] = useState(
    (restaurante?.horario_fechamento ?? '').slice(0, 5)
  );
  const logradouro  = restaurante?.logradouro  ?? '';
  const numero      = restaurante?.numero      ?? '';
  const complemento = restaurante?.complemento ?? '';
  const bairro      = restaurante?.bairro      ?? '';
  const cidade      = restaurante?.cidade      ?? '';
  const estado      = restaurante?.estado      ?? '';
  const cep         = restaurante?.cep         ?? '';
  const [rating, setRating] = useState(restaurante?.rating?.toString() ?? '');
  const [priceRange, setPriceRange] = useState(restaurante?.price_range?.toString() ?? '');
  const [reservationsEnabled, setReservationsEnabled] = useState(restaurante?.reservations_enabled ?? false);
  const [filaAtiva, setFilaAtiva] = useState(restaurante?.fila_ativa ?? false);
  const [description, setDescription] = useState(restaurante?.description ?? '');
  const [intervaloReserva, setIntervaloReserva] = useState(restaurante?.intervalo_reserva?.toString() ?? '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateRestaurant({
        name,
        telefone,
        horario_abertura: horarioAbertura || null,
        horario_fechamento: horarioFechamento || null,
        rating: rating ? parseFloat(rating) : null,
        price_range: priceRange ? parseInt(priceRange) : null,
        reservations_enabled: reservationsEnabled,
        fila_ativa: filaAtiva,
        description: description || null,
        intervalo_reserva: intervaloReserva ? parseInt(intervaloReserva) : null,
        logradouro,
        numero,
        complemento: complemento || undefined,
        bairro,
        cidade,
        estado,
        cep,
      });
      toast.success('Configurações salvas!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    handleImageUpload(file);
  };

  const handleImageUpload = async (file: File) => {
    setUploadingImg(true);
    try {
      await uploadImagemRestaurant(file);
      toast.success('Imagem atualizada com sucesso!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao fazer upload da imagem.');
      setPreview(null);
    } finally {
      setUploadingImg(false);
    }
  };


  const imagemAtual = preview || restaurante?.imagem_url;

  const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors";

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-foreground">Configurações</h1>

      {/* Photo */}
      <div className="rounded-2xl bg-card p-6 shadow-card space-y-4">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Foto do restaurante
        </h2>

        <div className="flex items-center gap-5">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted">
            {imagemAtual ? (
              <img src={imagemAtual} alt="Foto do restaurante" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-3xl font-bold text-muted-foreground/20 font-display">
                  {restaurante?.name?.charAt(0) ?? 'R'}
                </span>
              </div>
            )}
            {uploadingImg && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">JPG, PNG ou WEBP · máx. 2MB</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadingImg}
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[36px]"
            >
              <Camera className="mr-2 h-4 w-4" />
              {uploadingImg ? 'Enviando...' : 'Alterar foto'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-5 rounded-2xl bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Dados do restaurante
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Nome</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Telefone</Label>
            <Input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={telefone}
              onChange={e => setTelefone(formatBrazilPhone(e.target.value))}
              placeholder="(11) 99999-9999"
              maxLength={16}
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <Label>Horário de funcionamento</Label>
            <div className="grid gap-4 sm:grid-cols-2">
              <TimePicker label="Abertura" value={horarioAbertura} onChange={setHorarioAbertura} placeholder="--:--" />
              <TimePicker label="Fechamento" value={horarioFechamento} onChange={setHorarioFechamento} placeholder="--:--" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Logradouro</Label>
            <Input value={logradouro} disabled />
          </div>

          <div className="space-y-1.5">
            <Label>Número</Label>
            <Input value={numero} disabled />
          </div>

          <div className="space-y-1.5">
            <Label>Complemento</Label>
            <Input value={complemento || '—'} disabled />
          </div>

          <div className="space-y-1.5">
            <Label>Bairro</Label>
            <Input value={bairro} disabled />
          </div>

          <div className="space-y-1.5">
            <Label>Cidade</Label>
            <Input value={cidade} disabled />
          </div>

          <div className="space-y-1.5">
            <Label>Estado</Label>
            <Input value={estado} disabled />
          </div>

          <div className="space-y-1.5">
            <Label>CEP</Label>
            <Input value={cep} disabled />
            <p className="text-xs text-muted-foreground">Para alterar o endereço, entre em contato com o suporte.</p>
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <Label>Descrição</Label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Conte um pouco sobre o seu restaurante..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none transition-colors"
            />
            <p className="text-xs text-muted-foreground">{description.length}/500</p>
          </div>

          <div className="space-y-1.5">
            <Label>Nota (rating)</Label>
            <Input type="number" min="0" max="5" step="0.1" value={rating} onChange={e => setRating(e.target.value)} placeholder="4.5" />
          </div>

          <div className="space-y-1.5">
            <Label>Faixa de preço</Label>
            <select value={priceRange} onChange={e => setPriceRange(e.target.value)} className={selectClass}>
              <option value="">Selecione...</option>
              <option value="1">R$ — Econômico</option>
              <option value="2">R$$ — Moderado</option>
              <option value="3">R$$$ — Caro</option>
              <option value="4">R$$$$ — Luxo</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="reservationsEnabled"
              checked={reservationsEnabled}
              onChange={e => setReservationsEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <Label htmlFor="reservationsEnabled" className="cursor-pointer">
              Aceita reservas
            </Label>
          </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="filaAtiva"
              checked={filaAtiva}
              onChange={e => setFilaAtiva(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <Label htmlFor="filaAtiva" className="cursor-pointer">
              Fila de espera ativa
            </Label>
          </div>

          {reservationsEnabled && (
            <div className="space-y-1.5">
              <Label>Intervalo entre reservas (minutos)</Label>
              <select value={intervaloReserva} onChange={e => setIntervaloReserva(e.target.value)} className={selectClass}>
                <option value="">Selecione...</option>
                <option value="15">15 minutos</option>
                <option value="30">30 minutos</option>
                <option value="45">45 minutos</option>
                <option value="60">1 hora</option>
                <option value="90">1h30</option>
                <option value="120">2 horas</option>
              </select>
            </div>
          )}
        </div>

        <Button type="submit" disabled={saving} className="min-h-[44px]">
          {saving ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
          ) : (
            'Salvar configurações'
          )}
        </Button>
      </form>
    </div>
  );
};

export default Settings;
