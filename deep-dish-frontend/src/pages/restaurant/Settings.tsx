import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Restaurante } from '@/types';
import { toast } from 'sonner';
import { Camera, Loader2 } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, updateRestaurant, uploadImagemRestaurant } = useAuth();
  const restaurante = user as Restaurante;

  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(restaurante?.name ?? '');
  const [telefone, setTelefone] = useState(restaurante?.telefone ?? '');
  const [horarioAbertura, setHorarioAbertura] = useState(
    restaurante?.horario_abertura ?? ''
  );
  const [horarioFechamento, setHorarioFechamento] = useState(
    restaurante?.horario_fechamento ?? ''
  );
  const [logradouro, setLogradouro] = useState(restaurante?.logradouro ?? '');
  const [numero, setNumero] = useState(restaurante?.numero ?? '');
  const [complemento, setComplemento] = useState(restaurante?.complemento ?? '');
  const [bairro, setBairro] = useState(restaurante?.bairro ?? '');
  const [cidade, setCidade] = useState(restaurante?.cidade ?? '');
  const [estado, setEstado] = useState(restaurante?.estado ?? '');
  const [cep, setCep] = useState(restaurante?.cep ?? '');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateRestaurant({
        name,
        telefone,
        horario_abertura: horarioAbertura || null,
        horario_fechamento: horarioFechamento || null,
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
      toast.error(
        err instanceof Error ? err.message : 'Erro ao salvar configurações.'
      );
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
      toast.error(
        err instanceof Error ? err.message : 'Erro ao fazer upload da imagem.'
      );
      setPreview(null);
    } finally {
      setUploadingImg(false);
    }
  };

  const imagemAtual = preview || restaurante?.imagem_url;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-foreground">
        Configurações
      </h1>

      <div className="rounded-xl bg-card p-6 shadow-card space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Foto do restaurante
        </h2>

        <div className="flex items-center gap-5">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
            {imagemAtual ? (
              <img
                src={imagemAtual}
                alt="Foto do restaurante"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-3xl font-bold text-muted-foreground/30">
                  {restaurante?.name?.charAt(0) ?? 'R'}
                </span>
              </div>
            )}

            {uploadingImg && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              JPG, PNG ou WEBP · máx. 2MB
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadingImg}
              onClick={() => fileInputRef.current?.click()}
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

      <form
        onSubmit={handleSave}
        className="space-y-4 rounded-xl bg-card p-6 shadow-card"
      >
        <h2 className="font-display text-lg font-semibold text-foreground">
          Dados do restaurante
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Nome</Label>
            <Input value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div>
            <Label>Telefone</Label>
            <Input
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Horário de funcionamento</Label>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="mb-2 block text-sm">Abertura</Label>
                <Input
                  type="time"
                  value={horarioAbertura}
                  onChange={e => setHorarioAbertura(e.target.value)}
                />
              </div>

              <div>
                <Label className="mb-2 block text-sm">Fechamento</Label>
                <Input
                  type="time"
                  value={horarioFechamento}
                  onChange={e => setHorarioFechamento(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Logradouro</Label>
            <Input
              value={logradouro}
              onChange={e => setLogradouro(e.target.value)}
              placeholder="Rua, avenida..."
            />
          </div>

          <div>
            <Label>Número</Label>
            <Input
              value={numero}
              onChange={e => setNumero(e.target.value)}
              placeholder="123"
            />
          </div>

          <div>
            <Label>Complemento</Label>
            <Input
              value={complemento}
              onChange={e => setComplemento(e.target.value)}
              placeholder="Sala, bloco..."
            />
          </div>

          <div>
            <Label>Bairro</Label>
            <Input value={bairro} onChange={e => setBairro(e.target.value)} />
          </div>

          <div>
            <Label>Cidade</Label>
            <Input value={cidade} onChange={e => setCidade(e.target.value)} />
          </div>

          <div>
            <Label>Estado</Label>
            <Input
              value={estado}
              onChange={e => setEstado(e.target.value)}
              maxLength={2}
              placeholder="SP"
            />
          </div>

          <div>
            <Label>CEP</Label>
            <Input
              value={cep}
              onChange={e => setCep(e.target.value)}
              placeholder="00000-000"
            />
          </div>
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar configurações'
          )}
        </Button>
      </form>
    </div>
  );
};

export default Settings;