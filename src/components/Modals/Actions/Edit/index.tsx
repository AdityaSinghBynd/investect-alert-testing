// import { useState, useCallback } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion } from "framer-motion";
// import { Plus, X } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { updateCollection } from "@/redux/Collections/CollectionThunk";
// import { clearErrors } from "@/redux/Collections/CollectionSlice";
// import { AppDispatch, RootState } from "@/store/store";
// import { CreateNewCollection } from "@/types/Collections/types";
// import { toast } from 'react-toastify';
// import { scheduleFormatToCron } from "@/utils/utils";
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

// interface EditModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   ownerId: string;
//   collectionId: string;
//   initialData?: Partial<CreateNewCollection>;
// }

// export function EditModal({
//   isOpen,
//   onClose,
//   ownerId,
//   collectionId,
//   initialData,
// }: EditModalProps) {
//   const dispatch = useDispatch<AppDispatch>();
//   const { loading, error } = useSelector((state: RootState) => ({
//     loading: state.collections.loading.update,
//     error: state.collections.error.update,
//   }));

//   const [formData, setFormData] = useState<CreateNewCollection>({
//     collectionName: initialData?.collectionName || "",
//     collectionDescription: initialData?.collectionDescription || "",
//     email: initialData?.email || "",
//     schedule: initialData?.schedule || "Daily",
//     ownerId,
//   });

//   const handleInputChange = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const { name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     },
//     [],
//   );

//   const setFrequency = useCallback(
//     (schedule: CreateNewCollection["schedule"]) => {
//       setFormData((prev) => ({ ...prev, schedule }));
//     },
//     [],
//   );

//   const resetForm = useCallback(() => {
//     if (initialData) {
//       setFormData({
//         collectionName: initialData.collectionName || "",
//         collectionDescription: initialData.collectionDescription || "",
//         email: initialData.email || "",
//         schedule: initialData.schedule || "Daily",
//         ownerId,
//       });
//     }
//     dispatch(clearErrors());
//   }, [dispatch, ownerId, initialData]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       const toastId = toast.loading("Updating Collection...");
//       if (!formData.collectionName.trim() || !formData.email.trim()) {
//         throw new Error("Please fill in all required fields");
//       }

//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(formData.email.trim())) {
//         throw new Error("Please enter a valid email address");
//       }

//       const result = await dispatch(
//         updateCollection({
//           id: collectionId,
//           body: {
//             ...formData,
//             collectionName: formData.collectionName.trim(),
//             email: formData.email.trim(),
//             schedule: scheduleFormatToCron(formData.schedule) as "Daily" | "Weekly" | "Monthly",
//           },
//         }),
//       ).unwrap();

//       toast.update(toastId, {
//         render: "Collection Updated.",
//         type: "success",
//         isLoading: false,
//         autoClose: 2000,
//       });

//       onClose();
//     } catch (err: any) {
//       const toastId = toast.loading("Updating Collection...");
//       console.error("Failed to update collection:", err);
//       toast.update(toastId, {
//         render: "Oops, something went wrong",
//         type: "error",
//         isLoading: false,
//         autoClose: 2000,
//       });
//     }
//   };

//   const handleClose = useCallback((e?: React.MouseEvent) => {
//     if (e) {
//       e.stopPropagation();
//     }
//     resetForm();
//     onClose();
//   }, [onClose, resetForm]);

//   const getFrequencyText = useCallback((schedule: string) => {
//     switch (schedule) {
//       case "Daily":
//         return "day at 3:30 AM";
//       case "Weekly":
//         return "Monday at 9:00 AM";
//       case "Monthly":
//         return "1st of the month at 9:00 AM";
//       default:
//         return "";
//     }
//   }, []);

//   const hasFormChanged = useCallback(() => {
//     return (
//       formData.collectionName !== initialData?.collectionName ||
//       formData.collectionDescription !== initialData?.collectionDescription ||
//       formData.email !== initialData?.email ||
//       formData.schedule !== initialData?.schedule
//     );
//   }, [formData, initialData]);

//   if (!isOpen) return null;

//   return (
//     <div 
//       className="fixed inset-0 bg-[#0026731A]/30 backdrop-blur-sm z-50" 
//       onClick={handleClose}
//     >
//       <div 
//         className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-[800px] z-[70]" 
//         onClick={(e) => e.stopPropagation()}
//       >
//         <Card className="border shadow-custom-blue m-4">
//           <CardHeader className="flex flex-row items-center justify-between border-b-[1.5px] border-[#eaf0fc] space-y-0 px-4 py-2">
//             <div className="flex flex-col gap-1 items-start">
//               <h2 className="text-[20px] font-medium">Edit Collection</h2>
//               <p className="text-[#4E5971] text-[14px] text-start">
//                 e.g. A "Fintech Monitoring" Collection delivers a weekly summary
//                 at your email address.
//               </p>
//             </div>
//             <div
//               className="rounded-full hover:bg-transparent self-start cursor-pointer"
//               onClick={handleClose}
//             >
//               <X className="h-5 w-5" />
//             </div>
//           </CardHeader>

//           <CardContent className="p-4">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-1">
//                 <label htmlFor="collectionName" className="text-sm font-normal">
//                   Name
//                 </label>
//                 <Input
//                   id="collectionName"
//                   name="collectionName"
//                   placeholder="Enter collection name"
//                   value={formData.collectionName}
//                   onChange={handleInputChange}
//                   required
//                   disabled={loading}
//                   className="h-12 focus-within:border-[#004ce6] shadow-none border-[#eaf0fc]"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label htmlFor="collectionName" className="text-sm font-normal">
//                   Description
//                 </label>
//                 <Input
//                   id="collectionDescription"
//                   name="collectionDescription"
//                   placeholder="Enter collection description"
//                   value={formData.collectionDescription}
//                   onChange={handleInputChange}
//                   required
//                   disabled={loading}
//                   className="h-12 focus-within:border-[#004ce6] shadow-none border-[#eaf0fc]"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-sm font-normal">Frequency</label>
//                 <div className="relative flex rounded-lg bg-[#f7f9fe] p-1 border-[#eaf0fc]">
//                   <motion.div
//                     className="absolute inset-0 z-0"
//                     initial={false}
//                     animate={{
//                       x:
//                         formData.schedule === "Daily"
//                           ? 0
//                           : formData.schedule === "Weekly"
//                             ? "33.33%"
//                             : "66.66%",
//                     }}
//                     transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//                   >
//                     <div className="h-full w-[33.33%] rounded-md bg-white border shadow-sm" />
//                   </motion.div>
//                   {["Daily", "Weekly", "Monthly"].map((option) => (
//                     <button
//                       key={option}
//                       type="button"
//                       disabled={loading}
//                       onClick={() =>
//                         setFrequency(option as CreateNewCollection["schedule"])
//                       }
//                       className={`relative z-10 flex-1 rounded-md px-3 py-2 text-sm transition-colors ${formData.schedule === option
//                         ? "text-black"
//                         : "text-muted-foreground hover:text-primary"
//                         }`}
//                     >
//                       {option}
//                     </button>
//                   ))}
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   Updates every {getFrequencyText(formData.schedule)}
//                 </p>
//               </div>
//               <div className="space-y-1">
//                 <label htmlFor="email" className="text-sm font-normal">
//                   Email
//                 </label>
//                 <Input
//                   id="email"
//                   name="email"
//                   type="email"
//                   placeholder="Provide the email where you want to be alerted"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   disabled={loading}
//                   className="h-12 focus-within:border-[#004ce6] shadow-none border-[#eaf0fc]"
//                 />
//               </div>
//               {error && <p className="text-sm text-red-500">{error}</p>}
//             </form>
//           </CardContent>

//           <CardFooter className="flex justify-end px-3 py-2 bg-transparent border-t border-[#eaf0fc]">
//             <Button
//               type="submit"
//               onClick={handleSubmit}
//               className="flex gap-2 items-center justify-center bg-[#004CE6] hover:bg-[#004CE6]/90 disabled:opacity-50"
//               disabled={loading || !hasFormChanged()}
//             >
//               {loading ? "Updating..." : "Update"}
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }