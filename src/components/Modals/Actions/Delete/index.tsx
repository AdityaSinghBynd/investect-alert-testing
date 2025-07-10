import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SessionUser } from '@/types/sessionUser';
// Components
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// Hooks
import { useNewsletterOperations } from '@/hooks/NewsletterOperations/useNewsletterOperations';
// Interfaces
interface DeleteModalProps {
  onClose: () => void;
  type: string;
  id: string;
  onDelete?: () => void;
}

export default function DeleteModal({ onClose, type, id, onDelete }: DeleteModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user as SessionUser;
  const { deleteNewsletter, deleteCompany } = useNewsletterOperations();
  console.log("type", type, "- id", id)

  // Delete function for newsletter and company
  const handleDelete = async () => {
    if (!id) return;

    try {
      if (type === "newsletter") {
        await deleteNewsletter.mutateAsync({
          userID: user.id,
          newsletterID: id
        });

        router.push("/");
      } else if (type === "company") {
        await deleteCompany.mutateAsync({
          userID: user.id,
          companyID: id
        });
        
        // Call onDelete callback if provided
        onDelete?.();
      }

      setTimeout(() => {
        onClose();
      }, 500);

    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
    }
  }

  // Handle outside click for closing the modal
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0026731A]/30 backdrop-blur-sm z-50" onClick={handleOutsideClick}>
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-[500px]">
        <Card className="border shadow-custom-blue m-4">
          <CardHeader className="space-y-1 px-4 py-3">
            <h2 className="text-[16px] font-semibold text-[#1C4980]">
              {type === "company" ? "Delete company" : "Delete newsletter"}
            </h2>
            <p className="text-[14px] text-[#1C4980]">
              {`This action will permanently delete the ${type} and cannot be undone.`}
            </p>
          </CardHeader>

          <CardContent className="p-3">
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-[14px] font-medium text-[#1C4980] border border-[#EAF0FC] rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteNewsletter.isPending || deleteCompany.isPending}
                className="px-4 py-2 text-[14px] font-medium text-white bg-[#D63500] rounded disabled:opacity-50"
              >
                {(deleteNewsletter.isPending || deleteCompany.isPending) ? "Deleting..." : "Delete"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
