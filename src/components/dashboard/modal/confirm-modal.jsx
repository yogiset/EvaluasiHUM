import { useConfirmModal } from "@/hooks/use-confirm-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ConfirmModal = () => {
  const { isOpen, config, onConfirm, onCancel, onClose } = useConfirmModal();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader className="border-b">
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>
        <div className="w-full space-y-4">
          <p>{config.message}</p>
          <div className="flex gap-x-2">
            <Button variant="sky" onClick={onConfirm}>
              Ya
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Tidak
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
