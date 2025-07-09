import React from 'react'
import Image from 'next/image';
// Images
import { Loader2 } from 'lucide-react';
import ByndLogo from '../../../../public/images/ByndLogo.svg';

export default function AppLoadingSkeleton() {
  return (
    <main className="flex w-full h-full flex-col items-center justify-center bg-layer-3 gap-6 transition-all duration-300 ease-in-out">

      <div className="flex items-center justify-center gap-2">
        <Image src={ByndLogo} alt="Bynd Logo" width={100} height={100} priority />
        <p className="text-[38px] text-text-primary font-medium ">
          Alerts
        </p>
      </div>

      <Loader2 className="w-10 h-10 text-button-primary animate-spin" />

    </main>
  )
}