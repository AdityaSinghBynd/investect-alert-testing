'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
// Components
import DeleteCompanyModal from '@/components/Modals/Actions/Delete'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// Redux
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
// Types
import { CompanyWithAlertData } from '@/hooks/Newsletter/newsletter.interface';
import { MoreVertical, Trash, Trash2 } from 'lucide-react'

const CompanyCard: React.FC<CompanyWithAlertData & { alertId: string, setIsDeleteModalOpen: (isOpen: boolean) => void }> = ({ logo, name, sector, company_id, alertId, setIsDeleteModalOpen }) => {
    const [open, setOpen] = useState(false);

    return (
        <Link
            href={`/newsletter/${alertId}/${company_id}`}
            className="group p-3 bg-layer-1 rounded-lg border border-[#eaf0fc] hover:bg-[#f7f9fe] transition-all cursor-pointer min-h-[160px] flex flex-col items-start justify-between gap-2"
        >
            <div className="w-12 h-12 relative rounded-full ">
                {logo ? (
                    <Image
                        src={logo}
                        alt={`${name}`}
                        fill
                        className="object-contain"
                        sizes="48px"
                        priority={false}
                    />
                ) : (
                    <div className="w-full h-12 bg-[#eaf0fc] rounded-full flex items-center justify-center" />
                )}
            </div>

            <div className="flex items-end justify-between w-full">

                <div className="flex flex-col">
                    <h3 className="text-text-primary font-medium">{name}</h3>
                    <span className="text-text-secondary text-sm">{sector}</span>
                </div>

                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                        <button className="mb-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="rounded border border-[#EAF0FC] bg-layer-1 shadow-custom-blue"
                    >
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDeleteModalOpen(true);
                                setOpen(false);
                            }}
                            className="flex items-center py-2 justify-start gap-2 text-[14px] text-text-primary rounded cursor-pointer"
                        >
                            <Trash className="h-6 w-6" />
                            Delete company
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </Link>
    )
}

// Main Component
const Companies = () => {
    const slug = useParams();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const activeNewsletterData = useSelector((state: RootState) => state.newsletter.newsletterData);
    const activeNewsletterCompanyData = activeNewsletterData?.find((newsletter) => newsletter?.alert?.alert_id === slug.slug);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
                {Array.isArray(activeNewsletterCompanyData?.companies) && activeNewsletterCompanyData?.companies.map((company) => (
                    <CompanyCard
                        key={company.company_id}
                        {...company}
                        alertId={slug.slug as string}
                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                    />
                ))}
            </div>

            {isDeleteModalOpen && (
                <DeleteCompanyModal
                    type="company"
                    id={activeNewsletterCompanyData?.company_id}
                    onClose={() => setIsDeleteModalOpen(false)}
                />
            )}
        </>
    )
}

export default Companies