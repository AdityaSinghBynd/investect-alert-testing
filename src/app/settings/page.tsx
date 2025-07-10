"use client"

import React from 'react'
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input'
import { SessionUser } from '@/types/sessionUser';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';


export default function SettingsPage() {
    const { data: session } = useSession();
    const user = session?.user as SessionUser;
    const router = useRouter();

    // Getting the user name from the email
    const userName = user?.email?.split('@')[0].split('.').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || '';

    // Getting the organisation name from the email
    const userOrganisation = user?.email?.split('@')[1].split('.')[0] || '';
    const handleSignOutClick = async () => {
      await signOut({ redirect: false });
      router.push("/auth/login");
    };

    return (
        <main className='flex bg-[#eaf0fc] min-h-screen w-full'>
            <div className="w-full bg-[#FFFFFFCC] m-3 ml-0 rounded-lg py-7 px-10 shadow-custom-blue-left">
                <div className="max-w-3xl mx-auto w-full">
                    {/* Settings Header */}
                    <h1 className="text-[28px] font-medium text-text-primary mb-3">Settings</h1>

                    {/* User Information Section */}
                    <div className="space-y-4 mb-12 border-t-2 border-[#EAF0FC] pt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary text-md">Name</span>
                            <Input
                                id="name"
                                type="text"
                                value={userName}
                                disabled
                                // onChange={(e) => setName(e.target.value)}
                                className="w-[260px] px-3 py-2.5 text-[16px] text-text-primary border-2 border-[#EAF0FC] rounded-sm focus:ring-1 focus:ring-[#004CE6] focus:border-[#004CE6] focus:outline-none placeholder:text-text-placeholder shadow-none"
                                placeholder="Your name"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary text-md">Email</span>
                            <Input
                                id="email"
                                type="text"
                                value={user?.email || ''}
                                disabled
                                placeholder="Your email"
                                className="w-[260px] px-3 py-2.5 text-[16px] text-text-primary border-2 border-[#EAF0FC] rounded-sm focus:ring-1 focus:ring-[#004CE6] focus:border-[#004CE6] focus:outline-none placeholder:text-text-placeholder shadow-none"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-text-secondary text-md">Organisation</span>
                            <Input
                                id="organisation"
                                type="text"
                                value={userOrganisation}
                                disabled
                                className="w-[260px] px-3 py-2.5 text-[16px] text-text-primary border-2 border-[#EAF0FC] rounded-sm focus:ring-1 focus:ring-[#004CE6] focus:border-[#004CE6] focus:outline-none placeholder:text-text-placeholder shadow-none"
                                placeholder="Your organisation name"
                            />
                        </div>
                    </div>

                    {/* System Section */}
                    <div className="mt-12 ">
                        <h2 className="text-[28px] font-medium text-text-primary mb-3">System</h2>

                        <div className="space-y-4  border-t-2 border-[#EAF0FC] pt-6">
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-md">Support</span>
                                <Button
                                    variant="ghost"
                                    className="max-w-max flex items-center bg-[#f7f9fe] text-text-primary rounded-md hover:bg-[#eaf0fc]"
                                    onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=support@bynd.ai&su=Need Contact Support', '_blank')}>
                                    Contact
                                </Button>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary text-md">You are signed in as <span className="text-[#004CE6]">"{user?.email || 'your@email.com'}"</span></span>
                                <Button
                                    variant="ghost"
                                    className="max-w-max flex items-center bg-[#f7f9fe] text-text-primary rounded-md hover:bg-[#eaf0fc]"
                                    onClick={handleSignOutClick}
                                >
                                    Sign out
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}