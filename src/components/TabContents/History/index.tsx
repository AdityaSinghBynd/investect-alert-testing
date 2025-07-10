import React from 'react'
import Image from 'next/image';
import { format } from 'date-fns';
import { useParams, useRouter } from "next/navigation"
// Images
import { Eye } from "lucide-react"
import noData from '../../../../public/images/noPreviewSVG.svg'
// components
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// Redux
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setNewsletterContent } from '@/redux/App/AppSlice';
import { setSelectedTimestamp } from '@/redux/Newsletter/newsletterSlice';
// Utilities
import { truncateText } from '@/utils';
// Interfaces
import type { CompanyWithNews, AlertRun } from '@/hooks/Newsletter/newsletter.interface';


const History = () => {
  const router = useRouter();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const receivedAlertsDataByDate = useSelector((state: RootState) => state.newsletter.newsletterHistoryData);

  // Get the active activeNewsletterDataByDate by finding the alert_id in the receivedAlertsDataByDate
  const activeNewsletterDataByDate = receivedAlertsDataByDate?.find((newsletter) => newsletter?.alert_id === slug);

  // This child component is used to render the first 3 companies in the table and the remaining count
  const renderCompanies = (companies: CompanyWithNews[]) => {
    const visibleCompanies = companies.slice(0, 4);
    const remainingCount = companies.length - 4;

    return (
      <div className="flex flex-wrap gap-2 overflow-y-auto scrollbar-hide flex items-start justify-start">
        {visibleCompanies.map((company) => (
          <div
            key={company.id}
            className="p-2 min-h-[30px] max-h-[30px] border border-primary rounded-md flex items-center gap-2 overflow-hidden"
          >
            {company.logo ? (
              <Image src={company.logo} alt={company.name} width={20} height={20} />
            ) : (
              <div className="w-5 h-5 bg-gray-200 rounded-sm" />
            )}
            {truncateText(company.name, 10)}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="p-1.5 min-h-[30px] max-h-[30px] border border-primary rounded-md bg-layer-3 flex items-center justify-center">
            + {remainingCount}
          </div>
        )}
      </div>
    );
  };

  // This child component is used to format the news points
  const formatNewsPoints = (companies: CompanyWithNews[]) => {
    const newsPoints: string[] = [];

    companies.forEach(company => {
      if (company.news && company.news.length > 0) {
        company.news.forEach(newsItem => {
          newsPoints.push(`• ${newsItem.title}`);
        });
      }
    });

    return newsPoints.join('\n');
  };

  const handleViewNewsletter = (slug: string, timestamp: string) => {
    dispatch(setSelectedTimestamp(timestamp));
    dispatch(setNewsletterContent("newsletter-emailContent"));
    router.push(`/newsletter/${slug}`);
  }

  return (
    <div className="w-full h-[calc(100vh-150px)] flex flex-col">
      <div className="flex-1 overflow-auto scrollbar-hide">
        <Table>
          {/* Table Header */}
          <TableHeader className="sticky top-0 z-10 border border-primary">
            <TableRow className='bg-layer-3 hover:bg-layer-3 border-y border-primary'>
              <TableHead className='text-[16px] text-text-primary border-r border-primary'>Date</TableHead>
              <TableHead className='text-[16px] text-text-primary border-r border-primary'>Companies</TableHead>
              <TableHead className='text-[16px] text-text-primary border-r border-primary'>News</TableHead>
              <TableHead className='text-[16px] text-text-primary border-r border-primary'>Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className='border border-primary'>
            {activeNewsletterDataByDate?.runs
              ?.filter((run: AlertRun) => {
                // Check if any company in this run has news
                return run.companies.some(company => company.news && company.news.length > 0);
              })
              .map((run: AlertRun) => (
                <TableRow
                  key={run.run_id}
                  className='min-h-[130px] max-h-[130px] bg-layer-1 hover:bg-layer-2 border border-primary text-md text-text-primary text-center'
                >
                  <TableCell className="font-medium border-r border-primary min-w-[140px] max-w-[140px] align-center">
                    {format(new Date(run.timestamp), 'dd MMM')}
                  </TableCell>

                  <TableCell className='border-r border-primary min-w-[200px] max-w-[200px] align-top'>
                    {renderCompanies(run.companies.filter(company => company.news && company.news.length > 0))}
                  </TableCell>

                  <TableCell className='border-r border-primary align-top'>
                    <div className="whitespace-pre-line text-left text-sm text-text-secondary">
                      {formatNewsPoints(run.companies)}
                    </div>
                  </TableCell>

                  <TableCell className="text-center min-w-[140px] max-w-[140px] align-center">
                    <Button
                      variant="outline"
                      className='border-primary text-text-primary shadow-none px-4 py-2 hover:bg-layer-1 hover:border-secondary'
                      onClick={() => handleViewNewsletter(slug as string, run.timestamp)}
                    >
                      <Eye className="h-5 w-5" />
                      <span className='text-md font-medium'>View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            {(!activeNewsletterDataByDate?.runs || activeNewsletterDataByDate.runs.length === 0) && (
              <TableRow className='h-[200px] bg-layer-1 hover:bg-layer-2 border border-primary text-md text-text-primary text-center'>
                <TableCell colSpan={4} className="text-center">
                  <div className="text-text-secondary">No Alert has been received yet</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default History;