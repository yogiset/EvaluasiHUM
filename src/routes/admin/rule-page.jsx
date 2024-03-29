// import { useState } from "react";
// import { useAuth } from "@/hooks/use-auth";
// import { Info, Trash2 } from "lucide-react";
// import axios from "axios";
// import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
// import { useConfirmModal } from "@/hooks/use-confirm-modal";
// import { toast } from "sonner";
// import { ForbiddenPage } from "@/components/dashboard/forbidden-page";
// import { SearchBar } from "@/components/dashboard/search-bar";
// import { Loading } from "@/components/dashboard/loading";
// import { Button } from "@/components/ui/button";
// import { RuleModal } from "@/components/dashboard/modal/rule-modal";
// import { EditRuleModal } from "@/components/dashboard/modal/edit-rule-modal";

// const RulePage = () => {
//   // const baseUrl = import.meta.env.VITE_BASE_URL;
//   const { role } = useAuth();
//   const [open, setOpen] = useState(false); // Modal state

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["get-rules"],
//     queryFn: fetchRules,
//   });

//   async function fetchRules() {
//     if (role !== "ADMIN") return [];

//     const response = await axios.get("http://localhost:8082/rule/all");

//     if (response.status === 200) {
//       return response.data;
//     }
//   }

//   // close modal ↓↓↓
//   function onClose() {
//     setOpen(false);
//   }

//   if (role !== "ADMIN") {
//     return <ForbiddenPage />;
//   }

//   if (error) {
//     return (
//       <div className="w-full h-full flex justify-center items-center">
//         <h1 className="text-xl font-semibold">Error!</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-full flex flex-col">
//       <div className="w-full flex justify-end items-center gap-x-2 p-2">
//         <SearchBar placeholder="Cari rule..." />
//         {/* modal start */}
//         <Button variant="sky" onClick={() => setOpen(true)}>
//           Tambah
//         </Button>

//         <RuleModal open={open} onClose={onClose} />
//         {/* modal end */}
//       </div>
//       {isLoading ? <Loading /> : <RulesList data={data.content} />}
//     </div>
//   );
// };

// const RulesList = ({ data }) => {
//   return (
//     <div className="w-full h-full overflow-y-auto space-y-2 pb-20">
//       {data.length < 1 ? (
//         <div className="w-full h-full flex justify-center items-center">
//           <h1 className="text-lg font-semibold">Rule sedang ngopi☕</h1>
//         </div>
//       ) : (
//         data.map((elem) => <RuleCard key={elem.idrule} data={elem} />)
//       )}
//     </div>
//   );
// };

// const RuleCard = ({ data }) => {
//   // const baseUrl = import.meta.env.VITE_BASE_URL;
//   const queryClient = useQueryClient();
//   const { newModal } = useConfirmModal();
//   const [editModal, setEditModal] = useState(false);

//   const mutation = useMutation({
//     mutationFn: (id) => {
//       return axios.delete(`http://localhost:8082/rule/hapusrule/${id}`);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["get-rules"] });
//       toast.success("Deleted successfully!");
//     },
//     onError: () => {
//       toast.error("Failed to delete!");
//     },
//   });

//   function deleteRule() {
//     newModal({
//       title: "Peringatan!",
//       message: "Anda yakin ingin menghapusnya?",
//     }).then((res) => {
//       if (res) {
//         mutation.mutate(data.idrule);
//       }
//     });
//   }

//   function onClose() {
//     setEditModal(false);
//   }
//   return (
//     <div className="w-full flex justify-between items-center border shadow-md rounded-md p-2">
//       <div className="space-y-1 truncate">
//         <h1 className="text-2xl font-semibold hover:underline truncate">
//           {data.rule}
//         </h1>
//         <h1 className="text-sm text-neutral-600">{data.jabatan}</h1>
//       </div>
//       <div className="flex items-center gap-x-2">
//         {/* modal start */}
//         <EditRuleModal open={editModal} onClose={onClose} data={data} />
//         <Button variant="sky" onClick={() => setEditModal(true)}>
//           <Info className="mr-0 md:mr-2 w-5 h-5" />
//           <span className="hidden md:inline">Detail</span>
//         </Button>
//         {/* modal end */}

//         <Button variant="destructive" onClick={deleteRule}>
//           <Trash2 className="mr-0 md:mr-2 w-5 h-5" />
//           <span className="hidden md:inline">Hapus</span>
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default RulePage;
