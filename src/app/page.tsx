'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { SessionUser } from '@/types/sessionUser';
// Images 
import NoDeliveriesImage from '../../public/images/noPreviewSVG.svg';
// Redux
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
// Utils
import { truncateText } from '@/utils';

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user as SessionUser;

  const { newsletterData, newsletterHistoryData } = useSelector((state: RootState) => state.newsletter);

  // Getting the user name from the email
  const userName = useMemo(() =>
    user?.email?.split('@')[0].split('.').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || '',
    [user?.email]
  );

  // Process newsletter data to get title and companies with news for each newsletter
  const processedNewsletterData = useMemo(() => {
    if (!newsletterData || !newsletterHistoryData || newsletterData.length === 0) return [];

    return newsletterData.map(newsletter => {
      // Find corresponding history data for this newsletter
      const historyData = newsletterHistoryData.find(
        history => history.alert_id === newsletter.alert?.alert_id
      );

      if (!historyData?.runs || historyData.runs.length === 0) return null;

      // Get the latest run
      const latestRun = historyData.runs[0];

      // Filter companies that have news
      const companiesWithNews = latestRun.companies.filter(
        company => company.news && company.news.length > 0
      );

      return {
        id: newsletter.alert?.alert_id,
        title: newsletter.alert?.title || 'Untitled Newsletter',
        companies: companiesWithNews.map(company => ({
          id: company.id,
          name: company.name,
          logo: company.logo,
          sector: company.sector,
          news: company.news.map(newsItem => newsItem.title)
        }))
      };
    }).filter(Boolean);

  }, [newsletterData, newsletterHistoryData]);

  return (
    <main className='flex bg-[#eaf0fc] min-h-screen w-full'>
      <div className="w-full h-screen bg-[#FFFFFFCC] m-3 rounded-lg pt-3 pb-[100px] px-6 shadow-custom-blue-left overflow-y-auto scrollbar-hide">
        <header className='mb-6'>
          <h1 className="text-3xl font-medium text-text-primary">Morning {userName ? userName : 'Person'}! Here are your recent deliveries</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {processedNewsletterData.length > 0 ? (
            processedNewsletterData.map((newsletter, index) => (
              <Link href={`/newsletter/${newsletter.id}`} key={index} className='flex flex-col gap-2 border border-[#EAF0FC] rounded-xl p-3 w-full min-h-[250px] max-h-[300px] bg-layer-1 hover:shadow-custom-blue transition-shadow duration-200'>
                {/* Newsletter Title */}
                <h2 className='text-xl font-medium text-text-primary'>{newsletter.title}</h2>

                {/* Companies Grid */}
                <div className="flex flex-wrap gap-2">
                  {newsletter.companies.map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center gap-2 px-2 py-1 rounded-lg border border-[#EAF0FC] bg-layer-1 hover:bg-[#f8fafd] transition-colors duration-200 max-w-max"
                    >
                      {company.logo ? (
                        <Image
                          src={company.logo}
                          alt={company.name}
                          width={16}
                          height={16}
                          className="rounded-sm"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-[#EAF0FC] rounded-full"/>
                      )}
                      <span className="text-sm font-medium text-text-primary truncate">
                        {company.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Top Headlines */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-md font-medium text-text-primary">Top headlines</h3>
                  <div className="flex flex-col gap-1">
                    {newsletter.companies.map(company =>
                      company.news.map((headline, idx) => (
                        <p key={`${company.id}-${idx}`} className="text-sm text-text-secondary">
                          • {truncateText(headline, 100)}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className='flex flex-col items-center justify-center w-full col-span-2 gap-6'>
              <Image src={NoDeliveriesImage} alt="No deliveries found" width={200} height={200} />
              <p className="text-md text-text-secondary">You don't have any deliveries yet. When you do, they'll show up here.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
