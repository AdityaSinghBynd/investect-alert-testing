'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
// Types
import { CompanyWithAlertData } from '@/hooks/Newsletter/newsletter.interface';

interface AddCompanyCardProps {
    onClick: () => void
    className?: string
}

// Components
const AddCompanyCard: React.FC<AddCompanyCardProps> = ({ onClick, className = '' }) => {
    return (
        <button
            onClick={onClick}
            className={`p-6 bg-[#f7f9fe] text-[#001742] rounded-lg border border-[#eaf0fc] transition-all w-full h-full flex flex-col items-center justify-center gap-2 min-h-[160px] hover:text-[#004CE6] ${className}`}
            aria-label="Add new company"
        >
            <Plus className="w-7 h-7" />
        </button>
    )
}

const CompanyCard: React.FC<CompanyWithAlertData & { alertId: string }> = ({ logo, name, sector, company_id, alertId }) => {
    return (
        <Link
            href={`/newsletter/${alertId}/${company_id}`}
            className="p-3 bg-white rounded-lg border border-[#eaf0fc] hover:bg-[#f7f9fe] transition-all cursor-pointer min-h-[160px] flex flex-col items-start justify-between gap-2"
        >
            <div className="w-12 h-12 relative rounded-full ">
                <Image
                    src={logo || ""}
                    alt={`${name} logo`}
                    fill
                    className="object-contain"
                    sizes="48px"
                    priority={false}
                />
            </div>
            <div className="flex flex-col">
                <h3 className="text-[#001742] font-medium">{name}</h3>
                <span className="text-[#4e5971] text-sm">{sector}</span>
            </div>
        </Link>
    )
}

// Main Component
const Companies: React.FC<{ companiesData?: CompanyWithAlertData[], alertId: string }> = ({ companiesData, alertId }) => {

    const handleAddCompany = React.useCallback(() => {
        console.log('Add company clicked')
    }, [])
    console.log("companiesData", companiesData);
    return (
        <div
            id="companies"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 "
            role="grid"
        >
            {/* <AddCompanyCard onClick={handleAddCompany} /> */}
            {Array.isArray(companiesData) && companiesData.map((company, index) => (
                <CompanyCard
                    key={company.company_id}
                    {...company}
                    alertId={alertId}
                />
            ))}
        </div>
    )
}

export default Companies