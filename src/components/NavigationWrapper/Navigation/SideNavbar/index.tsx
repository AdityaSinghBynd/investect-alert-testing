"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
// Images
import { Home, Settings, Plus } from "lucide-react";
import ByndLogo from "../../../../../public/images/ByndLogo.svg";
// Components
import DeleteNewsletterModal from "@/components/Modals/Actions/Delete";
import NewsletterModal from "@/components/Modals/CreateNewsletter";
// Redux
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setNewsletterList, setActiveNewsletter } from "@/redux/Newsletter/newsletterSlice";
import { setIsNewsletterModalOpen } from "@/redux/Modals/Newsletter/newsletterModalSlice";
// Types
import { SessionUser } from "@/types/sessionUser";
import { setNewsletterContent } from "@/redux/App/AppSlice";


export default function SideNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user as SessionUser;
  const isSettingsPath = pathname === "/settings";
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isNewsletterModalOpen = useSelector((state: RootState) => state.newsletterModal.isNewsletterModalOpen);
  const newslettersList = useSelector((state: RootState) => state.newsletter.newsletterList);

  const handleNavLinkClick = (alert_id: string) => {
    dispatch(setNewsletterContent("newsletter-tabContent"))
    dispatch(setActiveNewsletter(newslettersList.find((newsletter) => newsletter.alert?.alert_id === alert_id)))
    router.push(`/newsletter/${alert_id}`);
  }
  return (
    <>
      <nav className="w-[230px] h-screen bg-layer-4 flex flex-col p-3">
        {/* Logo Section */}
        <header className="flex items-center justify-center gap-2 mb-6">
          <Image src={ByndLogo} alt="Bynd Logo" width={70} height={70} loading="eager" />
          <span className="text-2xl text-text-secondary font-normal">Alerts</span>
        </header>

        {/* Create Newsletter Button */}
        <button
          onClick={() => dispatch(setIsNewsletterModalOpen(true))}
          className="w-full bg-layer-3 font-semibold text-sm text-button-primary border border-primary hover:bg-layer-1 hover:border-secondary rounded-full py-2 px-4 flex items-center gap-1 transition-colors mb-3 items-center justify-center">
          <Plus className="h-5 w-5" />
          Create newsletter
        </button>

        {/* Home Link */}
        <Link
          href="/"
          className={`flex items-center gap-2 p-2 mb-2 rounded-md transition-colors text-sm border hover:bg-layer-1 hover:text-text-primary hover:border-secondary ${pathname === "/"
            ? "bg-layer-3 border-secondary text-text-primary"
            : "border-transparent text-text-secondary"
            }`}
        >
          <Home size={18} />
          <span>Home</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-col gap-1 space-y-1">
          <h3 className="text-sm font-semibold text-text-primary">Your Newsletters</h3>

          {newslettersList && newslettersList.length > 0 ? (
            newslettersList.map((alert) => (
              <button
                key={alert.alert_id}
                onClick={() => handleNavLinkClick(alert.alert_id)}
                className={`flex items-center gap-2 p-2 rounded-md transition-colors text-sm border hover:bg-layer-1 duration-0 hover:text-text-primary hover:border-secondary ${pathname.includes(`/newsletter/${alert.alert_id}`)
                  ? "bg-layer-3 border-secondary text-text-primary"
                  : "border-transparent text-text-secondary"
                  }`}
              >
                <span>{alert.title}</span>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 h-[100px]">
              <span className="text-sm text-text-secondary">No newsletters created</span>
            </div>
          )}
        </div>

        {/* User Profile Section */}
        <footer className={`mt-auto flex items-center justify-between border rounded-md p-2 ${isSettingsPath ? "bg-layer-2 border-secondary" : "bg-layer-4 border-transparent"}`}>
          <div className="flex items-center w-full gap-2">
            <div className="w-6 h-6 rounded-full bg-[#004CE6]/80 flex items-center justify-center text-white font-medium">
              {(user?.email?.charAt(0) || "?").toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-primary">
                {user?.email?.split('@')[0].split('.').map(word =>
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            </div>
          </div>
          <Link href="/settings">
            <Settings size={20} className={`hover:text-[#004CE6] transition-colors ${isSettingsPath ? "text-[#004CE6]" : "text-text-secondary"}`} />
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

      {/* Delete Newsletter Modal */}
      {isDeleteModalOpen && (
        <DeleteNewsletterModal
          onClose={() => setIsDeleteModalOpen(false)}
          type="newsletter"
          id={newslettersList?.find((newsletter) => newsletter.alert?.alert_id === pathname.split("/").pop())?.alert?.alert_id}
        />
      )}
    </>
  );
}