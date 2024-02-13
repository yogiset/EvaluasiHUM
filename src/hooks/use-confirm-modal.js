import { create } from "zustand";

export const useConfirmModal = create((set) => ({
  isOpen: false,
  config: { title: "", message: "" },
  onConfirm: null,
  onCancel: null,

  onClose: () => set({ isOpen: false }), // Function to close the modal

  newModal: ({ title, message }) =>
    // You can also add `reject` if you need it
    new Promise((resolve) => {
      set(() => ({
        isOpen: true,
        config: { title, message },
        onConfirm: () => {
          set({ isOpen: false });
          resolve(true);
        },
        onCancel: () => {
          set({ isOpen: false });
          resolve(false);
        },
      }));
    }),
}));
