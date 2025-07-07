import React from 'react'
import Image from 'next/image';
import { useRouter } from "next/navigation"
import { format } from 'date-fns';
// components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
// Images
import { Eye } from "lucide-react"
import noData from '../../../../public/images/noPreviewSVG.svg'
// Utilities
import { truncateText } from '@/utils';
// Interfaces
import type {
  CompanyWithNews,
  AlertRun,
  FetchReceivedAlertsResponse
} from '@/hooks/Newsletter/newsletter.interface';

interface HistoryProps {
  receivedAlertsDataByDate: FetchReceivedAlertsResponse;
  receivedAlertsDataByDateLoading: boolean;
}

const History = ({ receivedAlertsDataByDate, receivedAlertsDataByDateLoading }: HistoryProps) => {
  const router = useRouter();

  const renderCompanies = (companies: CompanyWithNews[]) => {
    const visibleCompanies = companies.slice(0, 3);
    const remainingCount = companies.length - 3;

    return (
      <div className="flex flex-wrap gap-2 overflow-y-auto scrollbar-hide flex items-center justify-center">
        {visibleCompanies.map((company) => (
          <span
            key={company.id}
            className="p-1 border border-[#eaf0fc] rounded-md flex items-center gap-2"
          >
            <Image src={company.logo} alt={company.name} width={20} height={20}/>
            {truncateText(company.name, 7)}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="p-1 border border-[#eaf0fc] rounded-md bg-[#f7f9fe]">
            + {remainingCount}
          </span>
        )}
      </div>
    );
  };

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

  if (receivedAlertsDataByDateLoading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto mt-1 flex flex-col gap-2 items-center">
        <div className="mb-1 mr-1 self-end">
          <div className="animate-spin rounded-full h-3 w-3 border-2 border-[#004CE6] border-t-transparent" />
        </div>
        <Table className="w-full bg-white rounded border border-[#eaf0f6]">
          <TableHeader className="bg-gray-50">
            <TableRow className="border-b">
              {Array.from({ length: 3 }).map((_, i) => (
                <TableHead key={`header-${i}`} className="border-r last:border-r-0 p-2">
                  <div className="h-4 w-full max-w-[120px] rounded-[2px] bg-gray-200 animate-pulse" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }).map((_, rowIndex) => (
              <TableRow key={`row-${rowIndex}`} className="border-b last:border-b-0 hover:bg-[#f7f9fe]">
                {Array.from({ length: 3 }).map((_, colIndex) => (
                  <TableCell key={`cell-${rowIndex}-${colIndex}`} className="border-r last:border-r-0">
                    <div
                      className="h-4 w-full rounded-[2px] bg-gray-200 animate-pulse"
                      style={{
                        animationDelay: `${rowIndex * 0.1 + colIndex * 0.05}s`,
                        maxWidth: colIndex === 0 ? "80px" : "80px",
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (!receivedAlertsDataByDate) {
    return (
      <div className="w-full p-4 text-center flex flex-col items-center justify-center gap-4">
        <Image src={noData} alt="No Data" width={200} height={200} />
        <div className="w-full text-center text-md text-[#4e5971] font-medium">No Alert has been received yet</div>
      </div>
    )
  }

  return (
    <div className="w-full h-[calc(100vh-150px)] flex flex-col">
      <div className="flex-1 overflow-auto scrollbar-hide">
        <Table>
          {/* Table Header */}
          <TableHeader className="sticky top-0 z-10">
            <TableRow className='bg-[#f7f9fe] hover:bg-[#f7f9fe] border-y border-[#eaf0fc]'>
              <TableHead className='text-[16px] text-[#001742] border-r border-[#eaf0fc]'>Date</TableHead>
              <TableHead className='text-[16px] text-[#001742] border-r border-[#eaf0fc]'>Companies</TableHead>
              <TableHead className='text-[16px] text-[#001742] border-r border-[#eaf0fc]'>News</TableHead>
              <TableHead className='text-[16px] text-[#001742] border-r border-[#eaf0fc]'>Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {receivedAlertsDataByDate.runs
              .filter((run: AlertRun) => {
                // Check if any company in this run has news
                return run.companies.some(company => company.news && company.news.length > 0);
              })
              .map((run: AlertRun) => (
              <TableRow
                key={run.run_id}
                className='min-h-[130px] max-h-[130px] bg-white hover:bg-[#fbfdff] text-md text-[#001742] text-center'
              >
                <TableCell className="font-medium border-r border-[#eaf0fc] min-w-[140px] max-w-[140px]">
                  {format(new Date(run.timestamp), 'dd MMM')}
                </TableCell>

                <TableCell className='border-r border-[#eaf0fc] min-w-[200px] max-w-[200px]'>
                  {renderCompanies(run.companies)}
                </TableCell>

                <TableCell className='border-r border-[#eaf0fc]'>
                  <div className="whitespace-pre-line text-left text-sm text-[#4e5971]">
                    {formatNewsPoints(run.companies)}
                  </div>
                </TableCell>

                <TableCell className="text-center min-w-[140px] max-w-[140px]">
                  <Button
                    variant="outline"
                    className='border-[#eaf0fc] text-[#001742] shadow-none px-3 py-1 hover:bg-white'
                    onClick={() => router.push(`/newsletter/history/${run.run_id}`)}
                  >
                    <Eye className="h-5 w-5" />
                    <span className='text-md font-medium'>View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default History;