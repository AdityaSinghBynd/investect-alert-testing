import React from "react";

const SchemaSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({length: 4}).map((_, index) => (
        <div key={index} className="w-full flex gap-3">
          <div className="h-9 bg-white rounded w-1/3 animate-pulse border-[1.5px] border-[#eaf0fc] shadow-custom-blue"></div>
          <div className="h-9 bg-white rounded w-2/3 animate-pulse border-[1.5px] border-[#eaf0fc] shadow-custom-blue"></div>
        </div>
      ))}
    </div>
  );
};
export default SchemaSkeleton;