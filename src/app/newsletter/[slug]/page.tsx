"use client";

import React from 'react'
import { useParams } from 'next/navigation';
// Images
import { Building2Icon, History, Settings } from 'lucide-react'
// Components
import HistoryComponent from '@/components/TabContents/History'
import CompaniesComponent from '@/components/TabContents/Companies'
import SettingsComponent from '@/components/TabContents/Settings'
import EmailTemplate from '@/components/EmailTemplate'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Redux
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
// Hooks
import { useFetchReceivedAlertsByDate, useFetchSingleNewsletterData } from '@/hooks/Newsletter/useNewsletter';


export default function NewsletterPage() {
    const slug = useParams();
    const { newsletterContent } = useSelector((state: RootState) => state.app);
    const { newsletterData } = useSelector((state: RootState) => state.newsletter);
    const activeNewsletter = newsletterData?.find((newsletter) => newsletter.alert?.alert_id === slug.slug);

    return (
        <main className='flex bg-layer-4 min-h-screen w-full overflow-hidden'>
            <div className="w-full bg-[#FFFFFFCC] m-3 ml-0 rounded-lg py-7 px-10 shadow-custom-blue-left">

                {/* Title and Tabs of the newsletter */}

                {newsletterContent === "newsletter-tabContent" ? (
                    <>
                        <h1 className="text-[24px] font-medium text-text-primary mb-4">{activeNewsletter?.alert?.title}</h1>
                        <Tabs defaultValue="history" className="w-full">

                            <TabsList className='p-0 mb-2 bg-transparent border-b border-primary rounded-none items-end'>
                                <TabsTrigger value="history" className="flex items-center py-2 text-md text-text-secondary rounded-none gap-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-button-primary hover:text-text-primary">
                                    <History className="w-5 h-5" />
                                    History
                                </TabsTrigger>
                                <TabsTrigger value="companies" className="flex items-center py-2 text-md text-text-secondary rounded-none gap-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-button-primary hover:text-text-primary">
                                    <Building2Icon className="w-5 h-5" />
                                    Your companies
                                </TabsTrigger>
                                <TabsTrigger value="settings" className="flex items-center py-2 text-md text-text-secondary rounded-none gap-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-button-primary hover:text-text-primary">
                                    <Settings className="w-5 h-5" />
                                    Settings
                                </TabsTrigger>
                            </TabsList>

                            {/* History */}
                            <TabsContent value="history">
                                <HistoryComponent />
                            </TabsContent>

                            {/* Companies */}
                            <TabsContent value="companies" className='h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide pb-[100px]'>
                                <CompaniesComponent />
                            </TabsContent>

                            {/* Settings */}
                            <TabsContent value="settings">
                                <SettingsComponent />
                            </TabsContent>
                        </Tabs>
                    </>
                ) : (
                    <>
                        <EmailTemplate />
                    </>
                )}
            </div>
        </main>
    )
}