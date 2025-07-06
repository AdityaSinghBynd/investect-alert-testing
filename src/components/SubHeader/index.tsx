import { useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

interface SubHeaderProps {
  variant?: 'collection' | 'alert';
  onCreate?: () => void;
  collectionData?: any;
  alertData?: any;
}

const SubHeader = memo(({
  variant = 'collection',
  collectionData,
  alertData,
}: SubHeaderProps) => {

  const renderHeaderContent = useCallback(() => {
    switch (variant) {
      case 'collection':
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center justify-start gap-3">
              {!collectionData ? (
                <div className="h-[42px] w-52 bg-gray-100 rounded animate-pulse" />
              ) : (
                <p className="text-[#001742] font-medium text-[24px] sm:text-[20px] md:text-[28px] lg:text-[28px]">
                  {collectionData?.collectionname}
                </p>
              )}
            </div>
            <Link href="/" className="hidden md:block">
              <Button variant="outline" className="px-4 py-2 font-medium gap-1.5 text-sm shadow-none bg-[#ffffff] hover:bg-[#004CE6]/90 hover:text-[#ffffff] text-[#004CE6] border-[#eaf0fc]">
                <Plus className="h-7 w-7" />
                Create alert
              </Button>
            </Link>
          </div>
        );
      case 'alert':
        return (
          <div className="flex items-center justify-start gap-3">
            <div className="flex items-center justify-start gap-3">
              <Link href={`/collection/${alertData?.collection?.collectionId}`} className="text-[#001742]">
                <ArrowLeft className="h-7 w-7" />
              </Link>
            </div>
            {!alertData ? (
              <div className="h-[42px] w-52 bg-gray-200 rounded animate-pulse" />
            ) : (
              <p className="text-[#001742] font-medium text-[24px] sm:text-[20px] md:text-[28px] lg:text-[28px]">
                <span className="text-[#9babc7] font-medium text-[24px] sm:text-[20px] md:text-[28px] lg:text-[28px]">{alertData?.collection?.collectionName} / </span>{alertData?.alert?.title}
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  }, [variant, collectionData, alertData]);

  return (
    <div className="flex items-center justify-between py-2 h-fit">
      <div className="flex w-full items-center justify-start">
        {renderHeaderContent()}
      </div>
    </div>
  );
});

SubHeader.displayName = 'SubHeader';

export default SubHeader;