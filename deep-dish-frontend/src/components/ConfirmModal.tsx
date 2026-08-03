import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<Props> = ({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirmar', isLoading }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="bg-card rounded-2xl">
      <DialogHeader>
        <DialogTitle className="font-display">{title}</DialogTitle>
        <DialogDescription className="leading-relaxed">{description}</DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2">
        <Button variant="outline" className="min-h-[40px]" onClick={onClose} disabled={isLoading}>Voltar</Button>
        <Button variant="destructive" className="min-h-[40px]" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Processando...' : confirmLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ConfirmModal;
