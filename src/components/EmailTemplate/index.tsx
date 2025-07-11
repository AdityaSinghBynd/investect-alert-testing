"use client"

import React, { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
// Images
import { ArrowLeft, Mail, Trash2 } from 'lucide-react'
import CompanyBanner from '../../../public/images/investecBanner.png'
// Components
import SendEmailModal from '@/components/Modals/EmailSend'
// Redux
import { RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { setNewsletterContent } from '@/redux/App/AppSlice'
import { setSelectedTimestamp, deleteNewsItem, restoreNewsItem } from '@/redux/Newsletter/newsletterSlice'
// Utils
import { getFaviconUrl, getCleanDomainName } from '@/utils/getFaviconUtils'
// Types
import { CompanyWithNews, NewsItem } from '@/hooks/Newsletter/newsletter.interface'
// Hooks
import { useSubmitUpdatedDataInNewsletterTemplate } from '@/hooks/NewsletterOperations/useNewsletterOperations'
import { debounce } from 'lodash'

const AlertArea = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
    const { slug } = useParams()

    // Get newsletter history data and selected timestamp from Redux
    const newsletterHistoryData = useSelector((state: RootState) => state.newsletter.newsletterHistoryData)
    const selectedTimestamp = useSelector((state: RootState) => state.newsletter.selectedTimestamp)
    const deletedNewsItems = useSelector((state: RootState) => state.newsletter.deletedNewsItems)

    // Find the specific newsletter data
    const activeNewsletterDataByDate = newsletterHistoryData?.find(
        (newsletter) => newsletter?.alert_id === slug
    )

    // Find the specific run based on timestamp
    const selectedRun = activeNewsletterDataByDate?.runs?.find(
        run => run.timestamp === selectedTimestamp
    )

    // Filter out companies with no news from the selected run
    const companiesWithNews = selectedRun?.companies.filter(
        company => company.news?.length > 0
    ) || []

    // API mutation hook
    const submitUpdatedData = useSubmitUpdatedDataInNewsletterTemplate()

    // Debounced API call
    const debouncedSubmit = useCallback(
        debounce((data) => {
            submitUpdatedData.mutate(data)
        }, 1500),
        []
    )

    // Effect to cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedSubmit.cancel()
        }
    }, [debouncedSubmit])

    const handleDeleteNewsItem = (companyId: string, newsIndex: number) => {
        if (!slug || !selectedTimestamp) return

        dispatch(deleteNewsItem({
            alertId: slug,
            timestamp: selectedTimestamp,
            companyId,
            newsItemIndex: newsIndex
        }))

        // Prepare and submit updated data
        if (activeNewsletterDataByDate && selectedRun) {
            const payload = {
                alert_id: slug as string,
                start_date: activeNewsletterDataByDate.start_date,
                end_date: activeNewsletterDataByDate.end_date,
                filtered_companies: selectedRun.companies.map(c => c.id),
                runs: activeNewsletterDataByDate.runs
            }
            debouncedSubmit(payload)
        }
    }

    const handleRestoreNewsItem = (companyId: string) => {
        if (!slug || !selectedTimestamp) return

        dispatch(restoreNewsItem({
            alertId: slug,
            timestamp: selectedTimestamp,
            companyId
        }))

        // Prepare and submit updated data
        if (activeNewsletterDataByDate && selectedRun) {
            const payload = {
                alert_id: slug as string,
                start_date: activeNewsletterDataByDate.start_date,
                end_date: activeNewsletterDataByDate.end_date,
                filtered_companies: selectedRun.companies.map(c => c.id),
                runs: activeNewsletterDataByDate.runs
            }
            debouncedSubmit(payload)
        }
    }

    const handleBackToNewsletter = () => {
        dispatch(setNewsletterContent("newsletter-tabContent"))
        dispatch(setSelectedTimestamp(null))
    }

    const handleSendEmailClick = () => {
        setIsEmailModalOpen(true)
    }

    const handleCloseEmailModal = () => {
        setIsEmailModalOpen(false)
    }

    const renderSource = (source: string, index: number) => {
        const url = source
        const name = getCleanDomainName(url)
        const faviconUrl = getFaviconUrl(url)

        return (
            <Link href={url} target='_blank' key={index}>
                {/* {faviconUrl && (
                    <Image
                        src={faviconUrl}
                        alt={name}
                        width={18}
                        height={18}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'
                        }}
                    />
                )} */}
                <span className="text-xs font-medium text-gray-600 underline">{name}</span>
            </Link>
        )
    }

    const renderNewsItem = (newsItem: NewsItem, newsIndex: number, companyId: string) => {
        const isDeleted = deletedNewsItems[`${slug}-${selectedTimestamp}-${companyId}`]?.some(
            item => item.title === newsItem.title
        )

        if (isDeleted) {
            return (
                <div key={newsIndex} className="mb-6 p-4 h-[150px] bg-gray-50 border border border-gray-300 rounded-lg">
                    <div className="flex flex-col justify-between items-center gap-4 h-full">
                        <p className="text-gray-500">News deleted</p>
                        <button
                            onClick={() => handleRestoreNewsItem(companyId)}
                            className="text-blue-500 text-sm font-medium p-2 border border-gray-200 hover:bg-gray-100 rounded-sm"
                        >
                            Restore
                        </button>
                    </div>
                </div>
            )
        }

        return (
            <div key={newsIndex} className="mb-6 group relative">
                {/* <button
                    onClick={() => handleDeleteNewsItem(companyId, newsIndex)}
                    className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-full rounded-md bg-red-100 hover:bg-red-100"
                >
                    <Trash2 className="w-4 h-4 text-red-500" />
                </button> */}

                {/* Title and sources */}
                <div className="flex items-center justify-start gap-2 flex-wrap mb-2">
                <h3 className="text-md font-semibold text-text-primary leading-tight">
                    {newsItem.title}
                </h3>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {newsItem.sources.map((source, sourceIndex) =>
                        renderSource(source, sourceIndex)
                    )}
                </div>
                </div>

                <ul className="space-y-1 mb-3">
                    {newsItem.keyPoints.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start gap-1.5 leading-tight">
                            <div className="w-1 h-1 bg-[#4e5971] rounded-full mt-2.5 flex-shrink-0"/>
                            <span className="text-sm text-text-secondary leading-relaxed">{point}</span>
                        </li>
                    ))}
                </ul>

            </div>
        )
    }

    const renderCompany = (company: CompanyWithNews) => {
        // Skip companies with no news
        if (!company.news?.length) return null

        return (
            <div key={company.id} className="mb-6">
                <div className="mb-4">
                    <h2 className="text-md font-semibold text-[#328589] mb-2">
                        {company.name}:
                    </h2>
                </div>

                <div className="space-y-8">
                    {company.news.map((newsItem, newsIndex) =>
                        renderNewsItem(newsItem, newsIndex, company.id)
                    )}
                </div>
            </div>
        )
    }

    const renderTopHeadlines = (companies: CompanyWithNews[]) => {

        return (
            <div className="space-y-2">
                    {companies.map((company) => 
                        company.news?.map((newsItem, index) => (
                            <div key={`${company.id}-${index}`} className="flex flex-col gap-2">
                                <div className="flex items-center justify-start gap-3">
                                    <p className="text-sm text-text-primary font-semibold">{newsItem.title}</p>
                                    <div className="flex items-center gap-2 flex-shrink-0 mb-1">
                                        {newsItem.sources.map((source, sourceIndex) =>
                                            renderSource(source, sourceIndex)
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
        )
    }

    // Show loading state if data is not available
    if (!selectedRun || !companiesWithNews.length) {
        return (
            <div className="max-w-7xl mx-auto my-3 p-8 text-center">
                <p className="text-text-secondary">No newsletter data available</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto my-3 border border-primary bg-layer-2 rounded-lg">

            {/* Header */}
            <header className='flex justify-between items-center border-b border-primary rounded-t-lg px-3 py-2 bg-layer-1'>
                <div className='flex items-center gap-2'>
                    <ArrowLeft className='text-text-primary w-5 h-5 cursor-pointer' onClick={handleBackToNewsletter} />
                    <p className='text-[14px] font-medium text-text-primary'>{selectedRun.date}</p>
                </div>

                <div
                    className='flex items-center gap-2 text-[14px] font-medium text-text-primary border border-transparent cursor-pointer hover:border-primary hover:bg-layer-3 px-2 py-1.5 rounded-md transition-colors'
                    onClick={handleSendEmailClick}
                >
                    <Mail className='text-text-primary w-4 h-4' />
                    Send as email
                </div>
            </header>

            {/* Main email content */}
            <main className='flex flex-col items-start justify-start max-w-5xl max-h-[90vh] mx-auto mt-5 pb-[100px] bg-layer-1 overflow-y-auto scrollbar-hide shadow-lg'>

                {/* Company Banner */}
                <Image src={CompanyBanner} alt='company banner' className='w-full h-42 object-fit' />

                {/* Company News */}
                <div className="flex flex-col px-8 py-6 mt-6 w-full border-t border-[#328589]">
                    {/* Date */}
                    <p className="text-sm text-text-secondary mb-6">{selectedRun.date}</p>

                    {/* Top Headlines */}
                    <div className="w-full bg-[#fbfbfb] border-b border-gray-300 mb-6 p-4">
                        <p className="text-md text-[#328589] font-bold mb-5">Good morning,</p>
                        {renderTopHeadlines(companiesWithNews)}
                    </div>

                    {/* News Snippets */}
                    <div className="w-full bg-[#edf1f3] p-4">
                        <p className="text-md text-[#328589] font-bold mb-5">News snippets</p>
                        {companiesWithNews.map(company => renderCompany(company))}
                    </div>
                </div>

            </main>

            {/* Send Email Modal */}
            {isEmailModalOpen && (
                <SendEmailModal
                    isOpen={isEmailModalOpen}
                    onClose={handleCloseEmailModal}
                    companiesWithNews={companiesWithNews}
                    date={selectedRun.date}
                />
            )}
        </div>
    )
}

export default AlertArea