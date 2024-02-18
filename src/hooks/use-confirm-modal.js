import { create } from "zustand";

export const useConfirmModal = create((set) => ({
  isOpen: false,
  config: { title: "", message: "" },
  onConfirm: null,
  onCancel: null,

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
