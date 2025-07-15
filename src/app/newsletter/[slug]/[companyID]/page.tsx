"use client"

import React, { useState, useMemo } from 'react'
import Image from 'next/image';
import { format, subDays, startOfWeek, startOfMonth, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
// Hooks
import { useFetchReceivedAlertsByCompanyID } from '@/hooks/Newsletter/useNewsletter'
import { FetchReceivedAlertsByCompanyIDPayload, FetchReceivedAlertsByCompanyIDResponse } from '@/hooks/Newsletter/newsletter.interface';
// Components
import CompanyNews from '@/components/TabContents/Companies/CompanyNews';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ListFilter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type DateFilter = 'today' | 'this_week' | 'this_month' | 'all_alerts';

export default function CompanyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { slug: alertId, companyID } = useParams();
  const [selectedFilter, setSelectedFilter] = useState<DateFilter>('all_alerts');

  // Use a fixed date range for the initial API call (e.g., last 30 days)
  const endDate = format(new Date(), 'yyyy-MM-dd');
  const startDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');

  const payload: FetchReceivedAlertsByCompanyIDPayload = {
    user_id: session?.user?.id || "",
    alert_id: alertId as string,
    start_date: startDate,
    end_date: endDate,
    company_ids: [companyID as string]
  };

  const {
    data: receivedAlertsDataByCompanyID,
    isLoading: receivedAlertsDataByCompanyIDLoading,
    isError: receivedAlertsDataByCompanyIDError
  } = useFetchReceivedAlertsByCompanyID(payload);

  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    if (!receivedAlertsDataByCompanyID) return undefined;

    const today = new Date();
    let dateRange: { start: Date; end: Date };

    switch (selectedFilter) {
      case 'today':
        dateRange = {
          start: startOfDay(today),
          end: endOfDay(today)
        };
        break;
      case 'this_week':
        dateRange = {
          start: startOfWeek(today),
          end: endOfDay(today)
        };
        break;
      case 'this_month':
        dateRange = {
          start: startOfMonth(today),
          end: endOfDay(today)
        };
        break;
      case 'all_alerts':
      default:
        return receivedAlertsDataByCompanyID; // Return all data
    }

    // Filter runs based on date range
    const filteredRuns = receivedAlertsDataByCompanyID.runs.map(run => {
      const runDate = parseISO(run.timestamp);
      
      if (!isWithinInterval(runDate, dateRange)) {
        return {
          ...run,
          companies: run.companies.map(company => ({
            ...company,
            news: [] // Clear news for runs outside date range
          }))
        };
      }
      return run;
    }).filter(run => run.companies.some(company => company.news.length > 0));

    return {
      ...receivedAlertsDataByCompanyID,
      runs: filteredRuns
    };
  }, [receivedAlertsDataByCompanyID, selectedFilter]);

  const filterLabels: Record<DateFilter, string> = {
    today: 'Today',
    this_week: 'This Week',
    this_month: 'This Month',
    all_alerts: 'All Alerts'
  };

  return (
    <main className='flex bg-layer-4 min-h-screen w-full'>
      <div className="w-full bg-[#FFFFFFCC] m-3 ml-0 rounded-lg py-7 px-10 shadow-custom-blue-left h-[calc(100vh-24px)] flex flex-col">

        {/* Header */}
        <header className='flex items-center justify-between gap-3 w-full py-4'>
          <div className='flex items-center gap-3'>
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
          </div>

          <div className='flex items-center gap-3'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-layer-2 border-secondary shadow-none hover:bg-layer-3 hover:shadow-custom-blue focus-visible:outline-none focus-visible:ring-0">
                  <ListFilter className="h-4 w-4" />
                  {filterLabels[selectedFilter]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-layer-1 border-secondary shadow-custom-blue">
                {Object.entries(filterLabels).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setSelectedFilter(key as DateFilter)}
                    className={`cursor-pointer border border-transparent mb-1 last:mb-0 ${selectedFilter === key
                      ? 'bg-layer-3 border-secondary hover:bg-layer-3 focus:bg-layer-3'
                      : 'hover:bg-layer-2 hover:border-secondary focus:bg-layer-2 focus:border-secondary'
                    }`}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <CompanyNews
            receivedAlertsDataByCompanyID={filteredData}
            isLoading={receivedAlertsDataByCompanyIDLoading}
          />
        </div>
      </div>
    </main>
  )
}