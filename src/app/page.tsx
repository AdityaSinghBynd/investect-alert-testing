'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { SessionUser } from '@/types/sessionUser';
// Images 
import NoDeliveriesImage from '../../public/images/noPreviewSVG.svg';
// Redux
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setNewsletterContent } from '@/redux/App/AppSlice';
import { setActiveNewsletter } from '@/redux/Newsletter/newsletterSlice';
// Utils
import { truncateText } from '@/utils';

export default function Home() {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const user = session?.user as SessionUser;
  const router = useRouter();
  const { newsletterData, newsletterHistoryData } = useSelector((state: RootState) => state.newsletter);
  const newslettersList = useSelector((state: RootState) => state.newsletter.newsletterList);
  
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

  const filteredProcessedNewsletterData = useMemo(() => {
    return processedNewsletterData.filter((newsletter) => 
      newsletter.companies.some(company => company.news && company.news.length > 0)
    );
  }, [processedNewsletterData]);

  const handleNewsletterClick = (newsletterId: string) => {
    dispatch(setNewsletterContent("newsletter-tabContent"))
    dispatch(setActiveNewsletter(newslettersList.find((newsletter) => newsletter.alert?.alert_id === newsletterId)))
    router.push(`/newsletter/${newsletterId}`);
  }

  return (
    <main className='flex bg-layer-4 min-h-screen w-full'>
      <div className="w-full bg-[#FFFFFFCC] m-3 ml-0 rounded-lg pt-7 pb-[100px] px-10 overflow-y-auto scrollbar-hide">
        <header className='mb-4'>
          <h1 className="text-[24px] font-medium text-text-primary">Hello {userName ? userName : 'Person'}, Here are your recent deliveries</h1>
        </header>

       <h2 className='text-xl font-medium text-text-primary mb-2'>Today</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[calc(100vh-100px)] pb-[150px] overflow-y-auto scrollbar-hide">
          {filteredProcessedNewsletterData.length > 0 ? (
            filteredProcessedNewsletterData.map((newsletter, index) => (
              <div onClick={() => handleNewsletterClick(newsletter.id)} key={index} className='flex flex-col gap-2.5 border border-primary rounded-xl p-3 w-full min-h-[250px] max-h-[300px] bg-layer-1 hover:bg-layer-2 hover:border-secondary hover:shadow-custom-blue transition-shadow duration-200 cursor-pointer'>
                {/* Newsletter Title */}
                <h2 className='text-xl font-medium text-text-primary'>{newsletter.title}</h2>

                {/* Companies Grid */}
                <div className="flex flex-wrap gap-2">
                  {newsletter.companies.map((company) => (
                    <Link
                      href={`/newsletter/${newsletter.id}/${company.id}`}
                      key={company.id}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 px-2 py-1 rounded-md border border-primary bg-layer-1 hover:border-secondary transition-colors duration-200 max-w-max"
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
                    </Link>
                  ))}
                </div>

                {/* Top Headlines */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-md font-medium text-text-primary">Top headlines</h3>
                  <div className="flex flex-col gap-1 overflow-y-auto scrollbar-hide max-h-[120px]">
                    {newsletter.companies.map(company =>
                      company.news.map((headline, idx) => (
                        <p key={`${company.id}-${idx}`} className="text-sm text-text-secondary">
                          • {truncateText(headline, 100)}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              </div>
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
