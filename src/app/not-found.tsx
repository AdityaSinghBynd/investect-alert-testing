'use client';

import Link from 'next/link';
import Image from 'next/image';
import ByndLogo from '../../public/images/ByndLogo.svg';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
            <div className="flex items-center gap-2 mb-6">
                <Image src={ByndLogo} alt="Bynd Logo" width={80} height={80} /> 
                <span className="text-3xl text-[#4e5971] font-medium">Alerts</span>
            </div>
            <div className="text-6xl font-bold text-gray-200 mb-4">404</div>
            <h1 className="text-3xl font-semibold mb-2">Page Not Found</h1>
            <p className="text-lg">Sorry, the page you are looking for does not exist.</p>
            <Link href="/" className="text-blue-600 underline mt-1">
                Go back home
            </Link>
        </div>
    );
}
