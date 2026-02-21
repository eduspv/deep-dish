import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search as SearchIcon } from 'lucide-react';

const Search: React.FC = () => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState('2');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (city) params.set('city', city);
    if (date) params.set('date', date);
    if (time) params.set('time', time);
    if (partySize) params.set('partySize', partySize);
    navigate(`/app/restaurants?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Buscar restaurantes</h1>
      <form onSubmit={handleSearch} className="space-y-4 rounded-xl bg-card p-6 shadow-card">
        <div className="grid gap-4 md:grid-cols-2">
          <div><Label>Nome</Label><Input placeholder="Nome do restaurante" value={name} onChange={e => setName(e.target.value)} /></div>
          <div><Label>Cidade</Label><Input placeholder="São Paulo" value={city} onChange={e => setCity(e.target.value)} /></div>
          <div><Label>Data</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
          <div><Label>Horário</Label><Input type="time" value={time} onChange={e => setTime(e.target.value)} /></div>
          <div><Label>Pessoas</Label><Input type="number" min="1" max="20" value={partySize} onChange={e => setPartySize(e.target.value)} /></div>
        </div>
        <Button type="submit" className="w-full md:w-auto"><SearchIcon className="mr-2 h-4 w-4" />Buscar</Button>
      </form>
    </div>
  );
};

export default Search;
