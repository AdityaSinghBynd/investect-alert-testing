"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
// Images
import { Home, Settings, Plus } from "lucide-react";
import ByndLogo from "../../../../../public/images/ByndLogo.svg";
// Components
import NewsletterModal from "@/components/Modals/Newsletter";
// Hooks
import { useFetchAllNewsletters } from "@/hooks/Newsletter/useNewsletter";
// Redux
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setNewsletterList, setActiveNewsletter } from "@/redux/Newsletter/newsletterSlice";
import { setIsNewsletterModalOpen } from "@/redux/Modals/Newsletter/newsletterModalSlice";
// Types
import { SessionUser } from "@/types/sessionUser";

export default function SideNavbar() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as SessionUser;
  const isSettingsPath = pathname === "/settings";
  const isNewsletterModalOpen = useSelector((state: RootState) => state.newsletterModal.isNewsletterModalOpen);
  const { data: newslettersList, isLoading: isNewslettersListLoading } = useFetchAllNewsletters(user?.id);

  return (
    <>
      <nav className="w-[250px] h-screen bg-[#f7f9fe] flex flex-col p-3">
        {/* Logo Section */}
        <header className="flex items-center justify-center gap-2 mb-6">
          <Image src={ByndLogo} alt="Bynd Logo" width={70} height={70} loading="eager" />
          <span className="text-2xl text-[#4e5971] font-normal">Alerts</span>
        </header>

        {/* Create Newsletter Button */}
        <button
          onClick={() => dispatch(setIsNewsletterModalOpen(true))}
          className="w-full bg-white text-[#004CE6] border border-[#eaf0fc] hover:bg-[#004CE6] hover:text-white rounded-full py-2 px-4 flex items-center gap-2 transition-colors mb-4">
          <Plus className="h-4 w-4" />
          Create Newsletter
        </button>

        {/* Home Link */}
        <Link
          href="/"
          className={`flex items-center gap-2 p-2 mb-4 text-[#4E5971] rounded-md transition-colors border hover:bg-white hover:text-[#001742] hover:border-[#eaf0fc] ${pathname === "/"
            ? "bg-white border-[#eaf0fc] text-[#001742]"
            : "border-transparent"
            }`}
        >
          <Home size={20} />
          <span>Home</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-col gap-1">
          <h3 className="text-md font-medium text-[#001742] mb-1">Your Newsletters</h3>

          {/* Newsletter Links */}
          {isNewslettersListLoading && !user?.id ? (
            <>
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="w-full animate-pulse">
                  <div className="h-[42px] w-full bg-[#FFFFFFCC] border border-[#eaf0fc] rounded mb-1" />
                </div>
              ))}
            </>
          ) : newslettersList?.alerts && newslettersList.alerts.length > 0 ? (
            newslettersList.alerts.map((alert) => (
              <Link
                key={alert.alert_id}
                href={`/newsletter/${alert.alert_id}`}
                onClick={() => dispatch(setActiveNewsletter(alert))}
                className={`flex items-center gap-2 p-2 text-[#4E5971] rounded-md transition-colors border hover:bg-white hover:text-[#001742] hover:border-[#eaf0fc] ${pathname.includes(`/newsletter/${alert.alert_id}`)
                    ? "bg-white border-[#eaf0fc] text-[#001742]"
                    : "border-transparent"
                  }`}
              >
                <span>{alert.title}</span>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 h-[100px]">
              <span className="text-sm text-[#4E5971]">No newsletters found</span>
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <footer className="mt-auto flex items-center justify-between">
          <div className="flex items-center w-full gap-3">
            <div className="w-8 h-8 rounded-full bg-[#004CE6]/80 flex items-center justify-center text-white font-medium">
              {(user?.email?.charAt(0) || "?").toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#001742]">
                {user?.email?.split('@')[0].split('.').map(word =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            </div>
          </div>
          <Link href="/settings">
            <Settings size={20} className={`hover:text-[#004CE6] transition-colors ${isSettingsPath ? "text-[#004CE6]" : "text-[#4e5971]"}`} />
          </Link>
        </footer>
      </nav>

      {/* Newsletter Modal */}
      {isNewsletterModalOpen && (
        <NewsletterModal
          isOpen={isNewsletterModalOpen}
          onClose={() => dispatch(setIsNewsletterModalOpen(false))}
        />
      )}
    </>
  );
}