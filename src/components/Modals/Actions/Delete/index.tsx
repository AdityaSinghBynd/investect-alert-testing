// import { toast } from 'react-toastify';
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { useDeleteCollection } from "@/hooks/Collections/useCollections";
// import { useDeleteAlert } from "@/hooks/Alerts/useAlerts";
// import { useRouter, usePathname } from 'next/navigation';

// interface DeleteModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   collectionId?: string;
//   alertId?: string;
//   type?: 'collection' | 'alert';
//   userId?: string;
// }

// export default function DeleteModal({
//   isOpen,
//   onClose,
//   collectionId,
//   alertId,
//   type = 'collection',
//   userId = ''
// }: DeleteModalProps) {
//   const deleteCollectionMutation = useDeleteCollection();
//   const deleteAlertMutation = useDeleteAlert();
//   const router = useRouter();
//   const pathname = usePathname();

//   const isDeleting = deleteCollectionMutation.isPending || deleteAlertMutation.isPending;

//   const handleDelete = async () => {
//     try {
//       const toastId = toast.loading(`Deleting ${type}...`);

//       if (type === 'alert' && alertId) {
//         await deleteAlertMutation.mutateAsync({ alertId, collectionId });
//       } else if (type === 'collection' && collectionId) {
//         await deleteCollectionMutation.mutateAsync({ collectionId, userId });

//         if (pathname?.includes(`/collection/${collectionId}`)) {
//           router.push('/');
//         }
//       }

//       toast.update(toastId, {
//         render: `${type === 'alert' ? 'Alert' : 'Collection'} Deleted.`,
//         type: "success",
//         isLoading: false,
//         autoClose: 2000,
//       });
//       onClose();
//     } catch (error) {
//       console.error(`Failed to delete ${type}:`, error);
//       toast.error(`Failed to delete ${type}`);
//     }
//   };

//   const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (e.target === e.currentTarget) {
//       e.stopPropagation();
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-[#0026731A]/30 backdrop-blur-sm z-50" onClick={handleOutsideClick}>
//       <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-[500px]">
//         <Card className="border shadow-custom-blue m-4">
//           <CardHeader className="space-y-1 px-4 py-3">
//             <h2 className="text-[16px] font-semibold text-[#1C4980]">
//               Remove {type === 'alert' ? 'Alert' : 'Collection'}
//             </h2>
//             <p className="text-[14px] text-[#1C4980]">
//               This action will permanently delete the {type} and cannot be undone.
//             </p>
//           </CardHeader>

//           <CardContent className="p-3">
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 text-[14px] font-medium text-[#1C4980] border border-[#EAF0FC] rounded"
//                 disabled={isDeleting}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 text-[14px] font-medium text-white bg-[#D63500] rounded disabled:opacity-50"
//                 disabled={isDeleting}
//               >
//                 {isDeleting ? "Removing..." : "Remove permanently"}
//               </button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
