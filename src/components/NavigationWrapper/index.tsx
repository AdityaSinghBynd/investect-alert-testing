'use client';

import { usePathname } from 'next/navigation';
import SideNavbar from '@/components/NavigationWrapper/Navigation/SideNavbar';

const authRoutes = ['/auth/login', '/auth/register', '/auth/password-change', '/auth/email-verify', '/auth/forgot-password'];

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldShowHeader = !authRoutes.includes(pathname);

  return (
    <div className="flex h-screen w-full relative">
      {shouldShowHeader && (
        <>
          <SideNavbar />
        </>
      )}
      <main className="flex-1 overflow-hidden scrollbar-hide w-full md:pt-0">
        {children}
      </main>
    </div>
  );
}