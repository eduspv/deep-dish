import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search as SearchIcon } from 'lucide-react';
import { TIPOS_RESTAURANTE } from '@/constants/tipos';



const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

const Search: React.FC = () => {
  const [q, setQ]           = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [bairro, setBairro] = useState('');
  const [cep, setCep]       = useState('');
  const [tipo, setTipo]     = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q)      params.set('q',      q);
    if (cidade) params.set('cidade', cidade);
    if (estado) params.set('estado', estado);
    if (bairro) params.set('bairro', bairro);
    if (cep)    params.set('cep',    cep);
    if (tipo)   params.set('tipo',   tipo);
    navigate(`/app/restaurants?${params.toString()}`);
  };

  const handleCep = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 8);
    setCep(v.length > 5 ? `${v.slice(0, 5)}-${v.slice(5)}` : v);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Buscar restaurantes</h1>
      <form onSubmit={handleSearch} className="space-y-4 rounded-xl bg-card p-6 shadow-card">

        {/* Busca livre */}
        <div>
          <Label>Busca livre</Label>
          <Input
            placeholder="Nome, bairro, cidade…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>

        {/* Grid de campos */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Cidade</Label>
            <Input
              placeholder="Ex: São Paulo"
              value={cidade}
              onChange={e => setCidade(e.target.value)}
            />
          </div>

          <div>
            <Label>Estado</Label>
            <select
              value={estado}
              onChange={e => setEstado(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">Selecione</option>
              {ESTADOS.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Bairro</Label>
            <Input
              placeholder="Ex: Vila Madalena"
              value={bairro}
              onChange={e => setBairro(e.target.value)}
            />
          </div>

          <div>
            <Label>CEP</Label>
            <Input
              placeholder="00000-000"
              value={cep}
              onChange={e => handleCep(e.target.value)}
            />
          </div>
        </div>

        {/* Tipo de culinária */}
        <div>
          <Label>Tipo do Restaurante</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {TIPOS_RESTAURANTE.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTipo(tipo === t.value ? '' : t.value)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors
                  ${tipo === t.value
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'bg-background hover:bg-muted text-muted-foreground'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full md:w-auto">
          <SearchIcon className="mr-2 h-4 w-4" />
          Buscar
        </Button>
      </form>
    </div>
  );
};

export default Search;