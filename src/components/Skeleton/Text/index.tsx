// used in -  PromptInputField.tsx

export default function TextSkeleton() {

    return (
        <div className="w-full animate-pulse">
            <div className="h-5 w-32 bg-[#F2F6FE] rounded mb-3" />
            <div className="space-y-3">
                <div className="h-5 bg-[#F2F6FE] rounded w-6/6" />
                <div className="h-5 bg-[#F2F6FE] rounded w-5/6" />
                <div className="h-5 bg-[#F2F6FE] rounded w-4/6" />
                <div className="h-5 bg-[#F2F6FE] rounded w-4/6" />
            </div>
        </div>
    );
}