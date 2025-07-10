"use client"

import React from 'react'
import Image from 'next/image';
import { format, subDays } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
// Hooks
import { useFetchReceivedAlertsByCompanyID } from '@/hooks/Newsletter/useNewsletter'
import { FetchReceivedAlertsByCompanyIDPayload } from '@/hooks/Newsletter/newsletter.interface';
// Components
import CompanyNews from '@/components/TabContents/Companies/CompanyNews';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

export default function CompanyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { slug: alertId, companyID } = useParams();
  const endDate = format(new Date(), 'yyyy-MM-dd');
  const startDate = format(subDays(new Date(), 10), 'yyyy-MM-dd');

  const payload: FetchReceivedAlertsByCompanyIDPayload = {
    user_id: session?.user?.id || "",
    alert_id: alertId as string,
    start_date: startDate, // Last 10 days
    end_date: endDate,
    company_ids: [companyID as string]
  };

  const {
    data: receivedAlertsDataByCompanyID,
    isLoading: receivedAlertsDataByCompanyIDLoading,
    isError: receivedAlertsDataByCompanyIDError
  } = useFetchReceivedAlertsByCompanyID(payload);

  return (
    <main className='flex bg-[#eaf0fc] min-h-screen w-full'>
      <div className="w-full bg-[#FFFFFFCC] m-3 ml-0 rounded-lg py-7 px-10 shadow-custom-blue-left h-[calc(100vh-24px)] flex flex-col">

        {/* Header */}
        <header className='flex items-center justify-start gap-3 w-full py-4'>
          <ArrowLeftIcon className="w-6 h-6 cursor-pointer" onClick={() => router.back()} />
          <h1 className="flex items-center gap-3 text-[20px] font-medium text-text-primary">
            {receivedAlertsDataByCompanyID?.runs[0]?.companies[0]?.logo ? (
              <Image 
                src={receivedAlertsDataByCompanyID.runs[0].companies[0].logo} 
                alt="Company Logo" 
                width={28} 
                height={28} 
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
            )}
            {receivedAlertsDataByCompanyID?.runs[0]?.companies[0]?.name}
          </h1>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <CompanyNews
            data={receivedAlertsDataByCompanyID}
            isLoading={receivedAlertsDataByCompanyIDLoading}
          />
        </div>
      </div>
    </main>
  )
}