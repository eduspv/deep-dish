import { useState, useRef, useEffect, useCallback, useId } from 'react';
import type { PointerEvent } from 'react';
import { Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface TimePickerProps {
  label?: string;
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  id?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const ITEM_HEIGHT = 40;

function hourMinuteFromValue(v: string | undefined) {
  if (!v) return { hour: '09', minute: '00' };
  const [h, m] = v.split(':');
  return {
    hour: (h ?? '09').padStart(2, '0'),
    minute: (m ?? '00').padStart(2, '0'),
  };
}
const VISIBLE_ITEMS = 5;

function ScrollColumn({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollStart = useRef(0);
  // Verdadeiro enquanto a própria coluna está causando a mudança de `value`
  // (wheel/drag/click). Evita que o efeito de sincronização abaixo puxe o
  // scroll de volta no meio do gesto do usuário (loop de snap-back).
  const isInteracting = useRef(false);
  const wheelAccum = useRef(0);

  const scrollToValue = useCallback(
    (val: string, smooth = true) => {
      const idx = items.indexOf(val);
      if (idx === -1 || !listRef.current) return;
      listRef.current.scrollTo({
        top: idx * ITEM_HEIGHT,
        behavior: smooth ? 'smooth' : 'auto',
      });
    },
    [items],
  );

  useEffect(() => {
    if (isInteracting.current) return;
    scrollToValue(value, false);
  }, [value, scrollToValue]);

  const releaseTimeout = useRef<ReturnType<typeof setTimeout>>();

  const commitChange = useCallback(
    (item: string) => {
      isInteracting.current = true;
      onChange(item);
      // Mantém a trava até a rolagem suave (scrollToValue) terminar; se
      // liberássemos no frame seguinte, o useEffect([value]) reagiria ao
      // novo valor e cortaria a animação com um "pulo" instantâneo.
      if (releaseTimeout.current) clearTimeout(releaseTimeout.current);
      releaseTimeout.current = setTimeout(() => {
        isInteracting.current = false;
      }, 300);
    },
    [onChange],
  );

  useEffect(() => () => {
    if (releaseTimeout.current) clearTimeout(releaseTimeout.current);
  }, []);

  const handleScroll = () => {
    if (!listRef.current || isDragging.current) return;
    const idx = Math.round(listRef.current.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    if (items[clamped] !== value) commitChange(items[clamped]);
  };

  // Handler nativo e não-passivo: o onWheel do React é passivo por padrão e
  // não permite preventDefault, então a rolagem "vazaria" para a página.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onWheel = (e: globalThis.WheelEvent) => {
      e.preventDefault();
      wheelAccum.current += e.deltaY;

      const threshold = 24; // evita pular vários itens por "notch" da rodinha
      if (Math.abs(wheelAccum.current) < threshold) return;

      const direction = wheelAccum.current > 0 ? 1 : -1;
      wheelAccum.current = 0;

      const currentIdx = items.indexOf(value);
      const nextIdx = Math.max(0, Math.min(currentIdx + direction, items.length - 1));
      const nextItem = items[nextIdx];
      if (nextItem !== value) {
        commitChange(nextItem);
        scrollToValue(nextItem);
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [items, value, commitChange, scrollToValue]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    isInteracting.current = true;
    startY.current = e.clientY;
    scrollStart.current = listRef.current?.scrollTop ?? 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !listRef.current) return;
    listRef.current.scrollTop = scrollStart.current + (startY.current - e.clientY);
  };

  const endDrag = () => {
    isDragging.current = false;
    if (!listRef.current) return;
    const idx = Math.round(listRef.current.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    commitChange(items[clamped]);
    scrollToValue(items[clamped]);
  };

  return (
    <div className="relative flex flex-col items-center" style={{ width: 56 }}>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-popover to-transparent"
        style={{ height: ITEM_HEIGHT * 2 }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 z-[5] rounded-md bg-primary/10"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          height: ITEM_HEIGHT,
        }}
      />
      <div
        ref={listRef}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="cursor-grab select-none overflow-y-scroll active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar]:bg-transparent"
        style={{
          height: ITEM_HEIGHT * VISIBLE_ITEMS,
          scrollSnapType: 'y mandatory',
        }}
      >
        <div style={{ height: ITEM_HEIGHT * 2 }} />
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              commitChange(item);
              scrollToValue(item);
            }}
            className={cn(
              'flex w-full items-center justify-center font-mono transition-all duration-150',
              item === value ? 'text-lg font-bold text-primary' : 'text-[15px] font-normal text-muted-foreground',
            )}
            style={{
              height: ITEM_HEIGHT,
              scrollSnapAlign: 'center',
            }}
          >
            {item}
          </button>
        ))}
        <div style={{ height: ITEM_HEIGHT * 2 }} />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-popover to-transparent"
        style={{ height: ITEM_HEIGHT * 2 }}
      />
    </div>
  );
}

export function TimePicker({
  label,
  value,
  onChange,
  placeholder = '--:--',
  id,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState(() => hourMinuteFromValue(value).hour);
  const [minute, setMinute] = useState(() => hourMinuteFromValue(value).minute);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const triggerId = id ?? `${generatedId}-trigger`;

  useEffect(() => {
    const { hour: h, minute: m } = hourMinuteFromValue(value);
    setHour(h);
    setMinute(m);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleConfirm = () => {
    onChange?.(`${hour}:${minute}`);
    setOpen(false);
  };

  const displayValue =
    open || (value && value !== '--:--') ? `${hour}:${minute}` : '';

  return (
    <div ref={containerRef} className="relative w-full font-sans">
      {label && (
        <label
          htmlFor={triggerId}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {label}
        </label>
      )}

      <button
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-11 w-full items-center gap-2 rounded-xl border-[1.5px] bg-background px-3.5 text-left text-[15px] font-medium transition-all duration-200',
          'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          open
            ? 'border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.12)]'
            : 'border-input',
        )}
      >
        <Clock
          size={16}
          strokeWidth={2}
          className={cn('shrink-0', open ? 'text-primary' : 'text-muted-foreground')}
          aria-hidden
        />
        <span
          className={cn(
            'min-w-0 flex-1 truncate',
            displayValue ? 'font-mono text-foreground' : 'text-muted-foreground',
          )}
        >
          {displayValue || placeholder}
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Selecionar horário"
          className="absolute left-0 z-50 mt-2 min-w-[180px] rounded-2xl border border-border bg-popover p-3 pt-4 shadow-lg"
        >
          <div className="mb-3 text-center text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Selecionar horário
          </div>
          <div className="flex items-center gap-1">
            <ScrollColumn items={HOURS} value={hour} onChange={setHour} />
            <span className="mb-0.5 font-mono text-2xl font-bold text-muted-foreground">:</span>
            <ScrollColumn items={MINUTES} value={minute} onChange={setMinute} />
          </div>
          <div className="mt-3 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-muted-foreground">Horário</span>
              <span className="font-mono text-lg font-bold text-primary">
                {hour}:{minute}
              </span>
            </div>
            <Button type="button" className="mt-2 w-full" onClick={handleConfirm}>
              Confirmar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
