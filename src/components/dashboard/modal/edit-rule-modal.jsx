// import { useState } from "react";
// import { PencilLine } from "lucide-react";
// import axios from "axios";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";

// export const EditRuleModal = ({ open, onClose, data }) => {
//   // const baseUrl = import.meta.env.VITE_BASE_URL;
//   const queryClient = useQueryClient();
//   const [isEdit, setIsEdit] = useState(false);
//   const [rule, setRule] = useState("");

//   const mutation = useMutation({
//     mutationFn: (formData) => {
//       return axios.put(
//         `http://localhost:8082/rule/editrule/${data.idrule}`,
//         formData
//       );
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["get-rules"] });
//       toast.success("Updated successfully!");
//       onClose();
//     },
//     onError: () => {
//       toast.error("Failed to update!");
//     },
//   });

//   function onSubmit() {
//     if (!rule) return;
//     const formData = { rule, jabatan: data.jabatan };

//     mutation.mutate(formData);
//   }
//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-h-screen overflow-y-auto">
//         <DialogHeader className="border-b">
//           <DialogTitle>Detail Rule</DialogTitle>
//         </DialogHeader>
//         <div className="w-full space-y-4">
//           <div className="w-full flex flex-col md:flex-row justify-between items-center md:gap-x-2 gap-y-4 md:gap-y-0">
//             <div className="w-full md:w-1/2 flex flex-col justify-center items-start gap-y-2">
//               <h1 className="font-semibold">Jabatan</h1>
//               <p className="w-full p-2 bg-neutral-100 rounded">
//                 {data.jabatan}
//               </p>
//             </div>
//             <div className="w-full md:w-1/2 flex flex-col justify-center items-start gap-y-2">
//               <h1 className="font-semibold">Kode rule</h1>
//               <p className="w-full p-2 bg-neutral-100 rounded">
//                 {data.koderule}
//               </p>
//             </div>
//           </div>
//           <div className="w-full space-y-2">
//             <h1 className="font-semibold">Rule</h1>
//             {isEdit ? (
//               <Input
//                 defaultValue={data.rule}
//                 onChange={(e) => setRule(e.target.value)}
//               />
//             ) : (
//               <p className="w-full bg-neutral-100 p-2">{data.rule}</p>
//             )}
//           </div>
//           {isEdit ? (
//             <div className="flex gap-x-2">
//               <Button
//                 variant="sky"
//                 onClick={onSubmit}
//                 disabled={mutation.isPending}
//               >
//                 Save
//               </Button>
//               <Button variant="outline" onClick={() => setIsEdit(false)}>
//                 Cancel
//               </Button>
//             </div>
//           ) : (
//             <Button variant="sky" onClick={() => setIsEdit(true)}>
//               <PencilLine className="w-4 h-4 mr-2" />
//               Edit
//             </Button>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
