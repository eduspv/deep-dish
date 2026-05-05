import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarDays, Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import EmptyState from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { reservationsService } from '@/services/reservations.service';
import { ApiError } from '@/services/httpClient';
import { Paginated, Reserva } from '@/types';
import { toast } from 'sonner';
import { formatBRT } from '@/lib/utils';

const formatDate = (iso: string) => formatBRT(iso, { day: '2-digit', month: '2-digit', year: 'numeric' });
const formatTime = (iso: string) => formatBRT(iso, { hour: '2-digit', minute: '2-digit' });

const EMPTY_PAGE: Paginated<Reserva> = { data: [], current_page: 1, last_page: 1, per_page: 10, total: 0 };

// ─── sub-componentes definidos fora do pai para evitar remontagem ───────────

const ReservaCard = ({ r, faded }: { r: Reserva; faded?: boolean }) => {
  const imagem   = r.mesa?.restaurante?.imagem_url;
  const name     = r.mesa?.restaurante?.name ?? 'Restaurante';
  const initial  = name.charAt(0).toUpperCase();

  return (
    <Link to={`/app/reservations/${String(r.id)}`} className="block group">
      <div className={`flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card transition-all duration-200 ease-out-expo group-hover:shadow-card-hover group-hover:-translate-y-0.5 ${faded ? 'opacity-60' : ''}`}>
        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
          {imagem
            ? <img src={imagem} alt="" className="h-full w-full object-cover" />
            : <span className="text-lg font-bold text-primary font-display">{initial}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{name}</p>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            {formatDate(r.horario_reserva)}
            <Clock className="h-3.5 w-3.5 ml-1 shrink-0" />
            {formatTime(r.horario_reserva)}
            {r.mesa && (
              <span className="hidden sm:inline">· {r.party_size ?? r.mesa.capacidade}/{r.mesa.capacidade} pessoas</span>
            )}
          </div>
        </div>
        <StatusBadge status={r.status} />
      </div>
    </Link>
  );
};

const Pagination = ({
  page, lastPage, onPrev, onNext,
}: { page: number; lastPage: number; onPrev: () => void; onNext: () => void }) => {
  if (lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-3">
      <Button size="sm" variant="outline" onClick={onPrev} disabled={page <= 1} className="h-8 w-8 p-0">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground">{page} / {lastPage}</span>
      <Button size="sm" variant="outline" onClick={onNext} disabled={page >= lastPage} className="h-8 w-8 p-0">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// ─── componente principal ────────────────────────────────────────────────────

const AppHome: React.FC = () => {
  const [activePage,    setActivePage]    = useState(1);
  const [finishedPage,  setFinishedPage]  = useState(1);
  const [activeData,    setActiveData]    = useState<Paginated<Reserva>>(EMPTY_PAGE);
  const [finishedData,  setFinishedData]  = useState<Paginated<Reserva>>(EMPTY_PAGE);
  const [loadingActive,   setLoadingActive]   = useState(true);
  const [loadingFinished, setLoadingFinished] = useState(true);

  const fetchActive = useCallback(async (page: number, silent = false) => {
    if (!silent) setLoadingActive(true);
    try {
      const data = await reservationsService.listUserReservations({ status_group: 'active', page, per_page: 10 });
      setActiveData(data);
    } catch (err) {
      if (!silent) toast.error(err instanceof ApiError ? err.message : 'Erro ao carregar reservas');
    } finally {
      if (!silent) setLoadingActive(false);
    }
  }, []);

  const fetchFinished = useCallback(async (page: number, silent = false) => {
    if (!silent) setLoadingFinished(true);
    try {
      const data = await reservationsService.listUserReservations({ status_group: 'finished', page, per_page: 10 });
      setFinishedData(data);
    } catch (err) {
      if (!silent) toast.error(err instanceof ApiError ? err.message : 'Erro ao carregar histórico');
    } finally {
      if (!silent) setLoadingFinished(false);
    }
  }, []);

  useEffect(() => { fetchActive(activePage); },   [fetchActive, activePage]);
  useEffect(() => { fetchFinished(finishedPage); }, [fetchFinished, finishedPage]);

  // Refetch silencioso ao voltar para a aba
  useEffect(() => {
    const onFocus = () => {
      fetchActive(activePage, true);
      fetchFinished(finishedPage, true);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchActive, fetchFinished, activePage, finishedPage]);

  const loading = loadingActive && loadingFinished;
  const hasAny  = activeData.total > 0 || finishedData.total > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Suas reservas</h1>
        <Link to="/app/search">
          <Button size="sm" className="min-h-[36px]">
            <Plus className="mr-1.5 h-4 w-4" /> Nova reserva
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-[72px] rounded-2xl" />)}
        </div>
      ) : !hasAny ? (
        <EmptyState
          icon={<CalendarDays className="h-7 w-7" />}
          title="Nenhuma reserva"
          description="Busque um restaurante e faça sua primeira reserva."
          action={<Link to="/app/search"><Button>Buscar restaurantes</Button></Link>}
        />
      ) : (
        <>
          {(activeData.total > 0 || loadingActive) && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Próximas
              </h2>
              {loadingActive ? (
                <div className="space-y-3">
                  {[1,2].map(i => <Skeleton key={i} className="h-[72px] rounded-2xl" />)}
                </div>
              ) : (
                <>
                  <div className="space-y-2.5 animate-stagger">
                    {activeData.data.map(r => <ReservaCard key={r.id} r={r} />)}
                  </div>
                  <Pagination
                    page={activePage}
                    lastPage={activeData.last_page}
                    onPrev={() => setActivePage(p => p - 1)}
                    onNext={() => setActivePage(p => p + 1)}
                  />
                </>
              )}
            </section>
          )}

          {(finishedData.total > 0 || loadingFinished) && (
            <section>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Finalizadas
              </h2>
              {loadingFinished ? (
                <div className="space-y-3">
                  {[1,2].map(i => <Skeleton key={i} className="h-[72px] rounded-2xl" />)}
                </div>
              ) : (
                <>
                  <div className="space-y-2.5">
                    {finishedData.data.map(r => <ReservaCard key={r.id} r={r} faded />)}
                  </div>
                  <Pagination
                    page={finishedPage}
                    lastPage={finishedData.last_page}
                    onPrev={() => setFinishedPage(p => p - 1)}
                    onNext={() => setFinishedPage(p => p + 1)}
                  />
                </>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default AppHome;
