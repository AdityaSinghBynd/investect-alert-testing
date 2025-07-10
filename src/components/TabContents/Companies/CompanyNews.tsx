import React from 'react';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
// Components
import TableSkeleton from '@/components/Skeleton/Table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// Utils
import { getCleanDomainName, getFaviconUrl } from '@/utils/getFaviconUtils';
// Interfaces
import { FetchReceivedAlertsByCompanyIDResponse } from '@/hooks/Newsletter/newsletter.interface';
interface CompanyNewsProps {
  data: FetchReceivedAlertsByCompanyIDResponse | undefined;
  isLoading: boolean;
}


export default function CompanyNews({ data, isLoading }: CompanyNewsProps) {
  if (isLoading) {
    return (
        <TableSkeleton />
    );
  }

  // Group news by run date
  const newsGroupedByRun = data?.runs.reduce((acc, run) => {
    const date = format(parseISO(run.timestamp), 'dd MMMM');
    const news = run.companies.flatMap(company => company.news || []);
    
    if (news.length > 0) {
      if (!acc[date]) {
        acc[date] = {
          timestamp: run.timestamp,
          news: []
        };
      }
      acc[date].news.push(...news);
    }
    
    return acc;
  }, {} as Record<string, { timestamp: string; news: any[] }>) || {};

  // Sort runs by date in descending order
  const sortedDates = Object.entries(newsGroupedByRun).sort((a, b) => {
    return new Date(b[1].timestamp).getTime() - new Date(a[1].timestamp).getTime();
  });

  if (sortedDates.length === 0) {
    return (
      <div className="w-full h-full mx-auto flex flex-col gap-2">
        <Table className="w-full h-full bg-layer-1 !rounded border border-primary">
          <TableHeader>
            <TableRow className="bg-layer-3 hover:bg-layer-3 border-b border-primary">
              <TableHead className="text-text-primary font-medium border-r border-primary">News</TableHead>
              <TableHead className="text-text-primary font-medium border-r border-primary">Description</TableHead>
              <TableHead className="text-text-primary font-medium border-r border-primary">Sources</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-[#ffffff]">
              <TableCell colSpan={3} className="text-center py-8 text-text-secondary">
                No news received from the selected company
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="w-full h-full mx-auto flex flex-col gap-4 mt-4">
      {sortedDates.map(([date, runData]) => (
        <div key={date} className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-text-primary mb-2">{date}</h2>
          <Table className="w-full h-full bg-layer-1 rounded border border-[#eaf0fc]">

            {/* Table Header */}
            <TableHeader>
              <TableRow className="bg-[#F3F6FF] hover:bg-[#F3F6FF] border-b border-[#eaf0fc]">
                <TableHead className="text-text-primary font-medium border-r border-[#eaf0fc]">News</TableHead>
                <TableHead className="text-text-primary font-medium border-r border-[#eaf0fc]">Description</TableHead>
                <TableHead className="text-text-primary font-medium border-r border-[#eaf0fc]">Sources</TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {runData.news.map((news: any, index: number) => (
                <TableRow key={index} className="hover:bg-[#f7f9fe] border-b border-[#eaf0fc]">

                  <TableCell className="text-text-primary border-r border-[#eaf0fc] min-w-[250px] max-w-[250px] align-top">
                    {news.title}
                  </TableCell>

                  <TableCell className="text-text-secondary border-r border-[#eaf0fc] align-top">
                    <ul className="list-disc pl-4 space-y-2">
                      {news.keyPoints.map((point: string, idx: number) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </TableCell>

                  <TableCell className="align-top">
                    <div className="flex items-center gap-2 min-w-[250px] max-w-[250px] flex-wrap">
                      {news?.sources?.map((sourceUrl: string, sourceIndex: number) => {
                        return (
                          <a
                            key={sourceIndex}
                            href={sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-text-primary border border-[#eaf0fc] hover:bg-white hover:border-secondary rounded-md px-2 py-1"
                          >
                            <Image src={getFaviconUrl(sourceUrl)} alt="Favicon" width={16} height={16} />
                            {getCleanDomainName(sourceUrl)}
                          </a>
                        );
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>
      ))}
    </div>
  );
} 