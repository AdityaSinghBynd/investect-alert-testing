import React from 'react';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
// Components
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
      <div className="w-full h-full max-w-[1200px] mx-auto flex flex-col gap-2 items-center">
        <div className="w-full">
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4" />
        </div>
        <Table className="w-full h-full bg-white rounded border border-[#eaf0fc]">
          <TableHeader className="bg-gray-50 p-0">
            <TableRow className="border-b">
              {['News', 'Description', 'Sources'].map((header, i) => (
                <TableHead key={`header-${i}`} className="border-r last:border-r-0 p-2">
                  <div className="h-4 w-full max-w-[120px] rounded-[2px] bg-gray-200 animate-pulse" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={`row-${rowIndex}`} className="border-b last:border-b-0 hover:bg-[#f7f9fe]">
                {Array.from({ length: 3 }).map((_, colIndex) => (
                  <TableCell key={`cell-${rowIndex}-${colIndex}`} className="border-r last:border-r-0">
                    <div
                      className="h-4 w-full rounded-[2px] bg-gray-200 animate-pulse"
                      style={{
                        animationDelay: `${rowIndex * 0.1 + colIndex * 0.05}s`,
                        maxWidth: "120px",
                      }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
      <div className="w-full h-full max-w-[1200px] mx-auto flex flex-col gap-2">
        <Table className="w-full h-full bg-white rounded border border-[#eaf0fc]">
          <TableHeader>
            <TableRow className="bg-[#F3F6FF] border-b border-[#eaf0fc]">
              <TableHead className="text-[#001742] font-medium">News</TableHead>
              <TableHead className="text-[#001742] font-medium">Description</TableHead>
              <TableHead className="text-[#001742] font-medium">Sources</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-[#4e5971] hover:bg-[#f7f9fe]">
                No news received from the selected company
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="w-full h-full max-w-[1200px] mx-auto flex flex-col gap-4 mt-4">
      {sortedDates.map(([date, runData]) => (
        <div key={date} className="flex flex-col gap-2">
          <h2 className="text-xl font-medium text-[#001742] mb-2">{date}</h2>
          <Table className="w-full h-full bg-white rounded border border-[#eaf0fc]">

            {/* Table Header */}
            <TableHeader>
              <TableRow className="bg-[#F3F6FF] border-b border-[#eaf0fc]">
                <TableHead className="text-[#001742] font-medium border-r border-[#eaf0fc]">News</TableHead>
                <TableHead className="text-[#001742] font-medium border-r border-[#eaf0fc]">Description</TableHead>
                <TableHead className="text-[#001742] font-medium border-r border-[#eaf0fc]">Sources</TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {runData.news.map((news: any, index: number) => (
                <TableRow key={index} className="hover:bg-[#f7f9fe]">

                  <TableCell className="text-[#001742] border-r border-[#eaf0fc]">
                    {news.title}
                  </TableCell>

                  <TableCell className="text-[#4e5971] border-r border-[#eaf0fc]">
                    <ul className="list-disc pl-4 space-y-2">
                      {news.keyPoints.map((point: string, idx: number) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {news?.sources?.map((sourceUrl: string, sourceIndex: number) => {
                        return (
                          <a
                            key={sourceIndex}
                            href={sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#001742] border border-[#eaf0fc] hover:bg-[#ffffff] rounded-md px-2 py-1"
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