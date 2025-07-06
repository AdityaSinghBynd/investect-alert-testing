"use client";

import React from 'react'
// Images
import { Building2Icon, History, Settings } from 'lucide-react'
// Components
import HistoryComponent from '@/components/NewsLetterComponents/History'
import CompaniesComponent from '@/components/NewsLetterComponents/Companies'
import SettingsComponent from '@/components/NewsLetterComponents/Settings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Redux
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
// Hooks
import { useFetchSingleNewsletterData } from '@/hooks/Newsletter/useNewsletter';

export default function NewsletterPage() {
    const { activeNewsletter } = useSelector((state: RootState) => state.newsletter);
    const { data: newsletterData, isLoading: isNewsletterDataLoading } = useFetchSingleNewsletterData(activeNewsletter?.alert_id);

    return (
        <main className='flex bg-[#eaf0fc] min-h-screen w-full overflow-hidden'>
            <div className="w-full bg-[#FFFFFFCC] m-3 rounded-lg py-3 px-6 shadow-custom-blue-left">

                {/* Title and Tabs of the newsletter */}
                <h1 className="text-3xl font-medium text-[#001742] mb-5">{activeNewsletter?.title}</h1>
                <Tabs defaultValue="history" className="w-full">

                    <TabsList className='p-0 mb-2 bg-transparent border-b border-[#EAF0FC] rounded-none items-end'>
                        <TabsTrigger value="history" className="flex items-center text-md rounded-none gap-2 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#004CE6]">
                            <History className="w-5 h-5" />
                            History
                        </TabsTrigger>
                        <TabsTrigger value="companies" className="flex items-center text-md rounded-none gap-2 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#004CE6]">
                            <Building2Icon className="w-5 h-5" />
                            Your companies
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center text-md rounded-none gap-2 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#004CE6]">
                            <Settings className="w-5 h-5" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* History */} 
                    <TabsContent value="history">
                        <HistoryComponent />
                    </TabsContent>

                    {/* Companies */}
                    <TabsContent value="companies" className='h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide pb-[100px]'>
                        <CompaniesComponent
                         companiesData={newsletterData?.companies}
                         alertId={activeNewsletter?.alert_id}
                        />
                    </TabsContent>

                    {/* Settings */}
                    <TabsContent value="settings">
                        <SettingsComponent />
                    </TabsContent>
                </Tabs>

            </div>
        </main>
    )
}