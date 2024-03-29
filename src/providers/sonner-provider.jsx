import { ConfirmModal } from "@/components/dashboard/modal/confirm-modal";
import { Toaster } from "@/components/ui/sonner";

export const SonnerProvider = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" />
      <ConfirmModal />
    </>
  );
};
