// used in - Collection/[slug]/page.tsx

import React from "react";

const CardSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="bg-white border border-[#eaf0fc] border-l-[#2D72FF] border-l-4 p-3  rounded-[8px] rounded-l-[2px] hover:shadow-custom-blue w-full h-32">
      <div className="h-6 bg-gray-100 rounded w-3/4 animate-pulse mb-2"></div>
      <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-1/3 animate-pulse"></div>
        </div>
      ))}
    </>
  );
};
export default CardSkeleton;
