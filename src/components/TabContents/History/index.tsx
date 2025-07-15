import React, { useState, useCallback, useMemo } from 'react';
import { format, parseISO, startOfDay, endOfDay, startOfWeek, startOfMonth, isWithinInterval } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
// Components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HoverPopover } from '@/components/ui/hover-popover';
import { ExpandableCellProvider, ExtendableCell } from '@/components/ui/expandableTableCell';
// Icons
import { Eye, ListFilter, CalendarIcon } from 'lucide-react';
// Utils
import { truncateText } from '@/utils/truncateTextUtils';
// Types
import { RootState } from '@/redux/store';
import { AlertRun, CompanyWithNews } from '@/hooks/Newsletter/newsletter.interface';
// Actions
import { setSelectedTimestamp } from '@/redux/Newsletter/newsletterSlice';
import { setNewsletterContent } from '@/redux/App/AppSlice';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type DateFilter = 'today' | 'this_week' | 'this_month' | 'all_alerts';

const History = () => {
  const router = useRouter();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const receivedAlertsDataByDate = useSelector((state: RootState) => state.newsletter.newsletterHistoryData);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilter>('all_alerts');
  const [overflowingCells, setOverflowingCells] = useState<Set<string>>(new Set());

  // Get the active newsletter data
  const activeNewsletterDataByDate = receivedAlertsDataByDate?.find((newsletter) => newsletter?.alert_id === slug);

  // Date filter labels
  const dateFilterLabels: Record<DateFilter, string> = {
    today: 'Today',
    this_week: 'This Week',
    this_month: 'This Month',
    all_alerts: 'All Alerts'
  };

  // Filter runs based on date range
  const filterRunsByDate = useCallback((runs: AlertRun[]) => {
    if (selectedDateFilter === 'all_alerts') return runs;

    const today = new Date();
    let dateRange: { start: Date; end: Date };

    switch (selectedDateFilter) {
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
      default:
        return runs;
    }

    return runs.filter(run => {
      const runDate = parseISO(run.timestamp);
      return isWithinInterval(runDate, dateRange);
    });
  }, [selectedDateFilter]);

  // Date filter dropdown component
  const DateFilterDropdown = React.memo(() => (
    <DropdownMenu open={isDateFilterOpen} onOpenChange={setIsDateFilterOpen}>
      <DropdownMenuTrigger asChild>
        <ListFilter className={`h-6 w-6 p-1 cursor-pointer ${selectedDateFilter !== 'all_alerts' ? 'text-blue-500 bg-layer-4 rounded-sm' : 'text-text-primary bg-transparent rounded-sm hover:bg-layer-4 hover:text-blue-500 transition-colors'}`} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[150px] bg-layer-1 border-secondary shadow-custom-blue"
      >
        {Object.entries(dateFilterLabels).map(([key, label]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => {
              setSelectedDateFilter(key as DateFilter);
              setIsDateFilterOpen(false);
            }}
            className={`cursor-pointer transition-colors mb-1 border border-transparent last:mb-0 ${selectedDateFilter === key
                ? 'bg-layer-3 border-secondary hover:bg-layer-3 focus:bg-layer-3'
                : 'hover:bg-layer-2 hover:border-secondary focus:bg-layer-2 focus:border-secondary'
              }`}
          >
            <span className={`text-sm ${selectedDateFilter === key ? 'text-text-primary' : 'text-text-primary'}`}>
              {label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ));

  // Get unique companies from all runs
  const uniqueCompanies = useMemo(() => {
    if (!activeNewsletterDataByDate?.runs) return [];

    const companiesSet = new Set();
    const companies: { id: string; name: string }[] = [];

    activeNewsletterDataByDate.runs.forEach((run: AlertRun) => {
      run.companies.forEach((company) => {
        if (!companiesSet.has(company.id) && company.news && company.news.length > 0) {
          companiesSet.add(company.id);
          companies.push({ id: company.id, name: company.name });
        }
      });
    });

    return companies.sort((a, b) => a.name.localeCompare(b.name));
  }, [activeNewsletterDataByDate]);

  // Handle overflow state for cells
  const handleCellOverflow = useCallback((cellId: string, isOverflowing: boolean) => {
    setOverflowingCells(prev => {
      const newSet = new Set(prev);
      if (isOverflowing) {
        newSet.add(cellId);
      } else {
        newSet.delete(cellId);
      }
      return newSet;
    });
  }, []);

  // Filter handler
  const handleCompanyFilter = useCallback((companyId: string) => {
    setSelectedCompanies((prev) => {
      if (prev.includes(companyId)) {
        return prev.filter((id) => id !== companyId);
      }
      return [...prev, companyId];
    });
  }, []);

  // Company filter dropdown component
  const CompanyFilterDropdown = React.memo(() => (
    <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <PopoverTrigger asChild>
        <ListFilter className={`  h-6 w-6 p-1 cursor-pointer ${selectedCompanies.length > 0 ? 'text-blue-500 bg-layer-4 rounded-sm' : 'text-text-primary bg-transparent rounded-sm hover:bg-layer-4 hover:text-blue-500 transition-colors'}`} />
      </PopoverTrigger>
      <PopoverContent
        align='end'
        sideOffset={5}
        className="w-60 px-3 py-2 bg-layer-2 border-secondary shadow-custom-blue !duration-0"
        style={{ transform: 'none' }}
      >
        <div className="space-y-4">
          <div className="font-medium text-text-primary text-sm">Filter by Companies</div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
            {uniqueCompanies.map((company) => (
              <div
                key={company.id}
                className="flex items-center space-x-2 border-b border-primary pb-2 last:border-b-0"
              >
                <Checkbox
                  id={company.id}
                  checked={selectedCompanies.includes(company.id)}
                  onCheckedChange={() => handleCompanyFilter(company.id)}
                  className='shadow-none rounded-sm border-secondary data-[state=checked]:bg-blue-500 data-[state=checked]:text-white'
                />
                <label
                  htmlFor={company.id}
                  className="text-sm text-text-primary cursor-pointer select-none flex-1"
                >
                  {company.name}
                </label>
              </div>
            ))}
          </div>
          {selectedCompanies.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCompanies([])}
              className="w-full text-xs border-primary text-text-primary hover:bg-layer-1 hover:border-secondary transition-colors"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  ));

  // This child component is used to render the first 3 companies in the table and the remaining count
  const renderCompanies = useCallback((companies: CompanyWithNews[]) => {
    // Filter companies with news first
    const companiesWithNews = companies.filter(company => company.news && company.news.length > 0);
    const visibleCompanies = companiesWithNews.slice(0, 2);
    const remainingCompanies = companiesWithNews.slice(2);
    const remainingCount = companiesWithNews.length - 2;

    if (companiesWithNews.length === 0) {
      return (
        <div className="text-text-secondary text-sm italic">
          No companies with news
        </div>
      );
    }

    const CompanyItem = ({ company }: { company: CompanyWithNews }) => (
      <Link
        href={`/newsletter/${slug}/${company.id}`}
        key={company.id}
        className="p-2 min-h-[30px] max-h-[30px] border border-primary hover:bg-white hover:border-secondary cursor-pointer rounded-md flex items-center gap-2 overflow-hidden bg-layer-2"
        title={company.name}
      >
        {company.logo ? (
          <Image
            src={company.logo}
            alt={company.name}
            width={20}
            height={20}
            className="flex-shrink-0 rounded-sm"
          />
        ) : (
          <div className="w-5 h-5 bg-gray-300 rounded-sm flex-shrink-0" />
        )}
        <span className="text-sm text-text-primary truncate">
          {truncateText(company.name, 10)}
        </span>
      </Link>
    );

    const RemainingCompaniesContent = (
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollbar-hide">
        {remainingCompanies.map((company) => (
          <Link
            href={`/newsletter/${slug}/${company.id}`}
            key={company.id}
            className="flex items-center justify-start gap-2 border border-primary rounded-sm hover:bg-white hover:border-secondary p-1 transition-colors cursor-pointer"
          >
            {company.logo ? (
              <Image
                src={company.logo}
                alt={company.name}
                width={24}
                height={24}
                className="rounded-sm"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-300 rounded-sm" />
            )}
            <span className="text-sm text-text-primary">
              {company.name}
            </span>
          </Link>
        ))}
      </div>
    );

    return (
      <div className="flex flex-wrap gap-2 overflow-y-auto scrollbar-hide">
        {visibleCompanies.map((company) => (
          <CompanyItem key={company.id} company={company} />
        ))}
        {remainingCount > 0 && (
          <HoverPopover
            content={RemainingCompaniesContent}
            align="start"
            className="w-auto min-w-[200px] max-w-[300px] p-3 bg-layer-1 border-secondary shadow-custom-blue"
          >
            <div className="p-1.5 min-h-[30px] max-h-[30px] border border-primary rounded-md bg-layer-3 flex items-center justify-center cursor-pointer hover:bg-layer-2 transition-colors" >
              <span className="text-sm text-text-secondary font-medium">
                +{remainingCount}
              </span>
            </div>
          </HoverPopover>
        )}
      </div>
    );
  }, []);

  // Format news points based on filter status
  const formatNewsPoints = useCallback((companies: CompanyWithNews[]) => {
    const newsPoints: string[] = [];

    companies.forEach(company => {
      if (company.news && company.news.length > 0) {
        if (selectedCompanies.length > 0) {
          // If companies are filtered, show key points
          if (selectedCompanies.includes(company.id)) {
            company.news.forEach(newsItem => {
              newsItem.keyPoints.forEach(point => {
                newsPoints.push(`• ${point}`);
              });
            });
          }
        } else {
          // If no filter, show titles
          company.news.forEach(newsItem => {
            newsPoints.push(`• ${newsItem.title}`);
          });
        }
      }
    });

    return newsPoints.join('\n');
  }, [selectedCompanies]);

  const handleViewNewsletter = useCallback((slug: string, timestamp: string) => {
    dispatch(setSelectedTimestamp(timestamp));
    dispatch(setNewsletterContent("newsletter-emailContent"));
    router.push(`/newsletter/${slug}`);
  }, [dispatch, router]);

  // Filter companies based on selection
  const filterCompanies = useCallback((companies: CompanyWithNews[]) => {
    if (selectedCompanies.length === 0) return companies;
    return companies.filter(company =>
      selectedCompanies.includes(company.id) && company.news && company.news.length > 0
    );
  }, [selectedCompanies]);

  // Filter runs that have companies with news
  const validRuns = useMemo(() => {
    const runs = activeNewsletterDataByDate?.runs || [];
    const dateFilteredRuns = filterRunsByDate(runs);

    return dateFilteredRuns.filter((run: AlertRun) => {
      const filteredCompanies = filterCompanies(run.companies);
      return selectedCompanies.length === 0
        ? run.companies.some(company => company.news && company.news.length > 0)
        : filteredCompanies.length > 0;
    });
  }, [activeNewsletterDataByDate?.runs, filterCompanies, selectedCompanies.length, filterRunsByDate]);

  return (
    <div className="w-full h-[calc(100vh-200px)] flex flex-col">
      <div className="flex-1 overflow-auto scrollbar-hide">
        <ExpandableCellProvider>
          <Table>
            {/* Table Header */}
            <TableHeader className="sticky top-0 z-10 border border-primary">
              <TableRow className='bg-layer-3 hover:bg-layer-3 border-y border-primary'>
                <TableHead className='text-[16px] text-text-primary border-r border-primary font-medium'>
                  <div className="flex items-center justify-between">
                    Date
                    <DateFilterDropdown />
                  </div>
                </TableHead>
                <TableHead className='text-[16px] text-text-primary border-r border-primary font-medium'>
                  <div className="flex items-center justify-between">
                    Companies
                    <CompanyFilterDropdown />
                  </div>
                </TableHead>
                <TableHead className='text-[16px] text-text-primary border-r border-primary font-medium'>
                  News
                </TableHead>
                <TableHead className='text-[16px] text-text-primary border-r border-primary font-medium text-center'>
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className='border border-primary'>
              {validRuns.map((run: AlertRun) => {
                const filteredCompanies = filterCompanies(run.companies);
                const newsCellId = `${run.run_id}-news`;
                const isNewsCellOverflowing = overflowingCells.has(newsCellId);
                const newsContent = formatNewsPoints(filteredCompanies.length > 0 ? filteredCompanies : run.companies);

                return (
                  <TableRow
                    key={run.run_id}
                    className='min-h-[84px] max-h-[84px] h-[84px] bg-layer-1 hover:bg-layer-2 border border-primary text-md text-text-primary transition-colors'
                  >
                    <TableCell className="font-medium border-r border-primary min-w-[140px] max-w-[140px] align-top px-4">
                      <time className="text-sm">
                        {format(new Date(run.timestamp), 'dd MMM')}
                      </time>
                    </TableCell>

                    <TableCell className='border-r border-primary min-w-[200px] max-w-[200px] align-top px-4'>
                      {renderCompanies(filteredCompanies.length > 0 ? filteredCompanies : run.companies)}
                    </TableCell>

                    <TableCell
                      className={`
                        border-r border-primary align-top min-w-[500px] max-w-[500px] px-4 transition-all duration-200
                        ${isNewsCellOverflowing ? 'pb-0' : 'pb-4'}
                      `}
                    >
                      <ExtendableCell
                        cellId={newsCellId}
                        onOverflowChange={(isOverflowing) => handleCellOverflow(newsCellId, isOverflowing)}
                      >
                        <div className="whitespace-pre-line text-left text-sm text-text-secondary">
                          {newsContent || 'No news available'}
                        </div>
                      </ExtendableCell>
                    </TableCell>

                    <TableCell className="text-center min-w-[140px] max-w-[140px] align-middle px-4">
                      <Button
                        variant="outline"
                        className='border-primary text-text-primary shadow-none px-4 py-2 hover:bg-layer-1 hover:border-secondary transition-colors'
                        onClick={() => handleViewNewsletter(slug as string, run.timestamp)}
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        <span className='text-md font-medium'>View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {validRuns.length === 0 && (
                <TableRow className='h-[200px] bg-layer-1 hover:bg-layer-2 border border-primary text-md text-text-primary text-center'>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="text-text-secondary">
                        {selectedCompanies.length > 0
                          ? 'No alerts found for selected companies'
                          : 'No alerts have been received yet'
                        }
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ExpandableCellProvider>
      </div>
    </div>
  )
}

export default History;