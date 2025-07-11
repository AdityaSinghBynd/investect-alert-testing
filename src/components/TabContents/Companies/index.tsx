'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
// Images
import { MoreVertical, Plus, Trash } from 'lucide-react'
// Components
import DeleteCompanyModal from '@/components/Modals/Actions/Delete'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// Redux
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setIsNewsletterModalOpen } from '@/redux/Modals/Newsletter/newsletterModalSlice'
import { setNewsletterData } from '@/redux/Newsletter/newsletterSlice';
// Types
import { CompanyWithAlertData } from '@/hooks/Newsletter/newsletter.interface';
interface AddCompanyCardProps {
    className?: string
}

// const AddCompanyCard: React.FC<AddCompanyCardProps> = ({ className = '' }) => {
//     const dispatch = useDispatch()

//     return (
//         <button
//             onClick={() => dispatch(setIsNewsletterModalOpen(true))}
//             className={`p-6 bg-[#f7f9fe] text-[#001742] rounded-lg border border-[#eaf0fc] transition-all w-full h-full flex flex-col items-center justify-center gap-2 min-h-[160px] hover:text-[#004CE6] ${className}`}
//             aria-label="Add new company"
//         >
//             <Plus className="w-7 h-7" />
//         </button>
//     )
// }

const CompanyCard: React.FC<CompanyWithAlertData & { alertId: string, setIsDeleteModalOpen: (isOpen: boolean) => void, company_id: string }> = ({ logo, name, sector, company_id, alertId, setIsDeleteModalOpen }) => {
    const [open, setOpen] = useState(false);

    return (
        <Link
            href={`/newsletter/${alertId}/${company_id}`}
            className={`group p-3 bg-layer-1 rounded-lg border border-primary hover:border-secondary hover:bg-layer-3 transition-all cursor-pointer min-h-[160px] flex flex-col items-start justify-between gap-2 ${open ? 'bg-layer-3 border-secondary' : 'bg-layer-1 border-primary'}`}
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
                        <button className={`mb-1 flex items-center justify-center ${open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="rounded border border-primary bg-layer-1 shadow-custom-blue"
                    >
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDeleteModalOpen(true);
                                setOpen(false);
                            }}
                            className="flex items-center py-2 justify-start gap-2 text-[14px] text-text-primary rounded-sm cursor-pointer duration-0 data-[highlighted]:bg-red-500 data-[highlighted]:text-white"
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
    const dispatch = useDispatch();
    const slug = useParams();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
    const activeNewsletterData = useSelector((state: RootState) => state.newsletter.newsletterData);
    const activeNewsletterCompanyData = activeNewsletterData?.find((newsletter) => newsletter?.alert?.alert_id === slug.slug);

    const handleCompanyDelete = () => {
        if (!selectedCompanyId || !activeNewsletterData) return;

        // Create updated newsletter data with the company removed
        const updatedNewsletterData = activeNewsletterData.map(newsletter => {
            if (newsletter?.alert?.alert_id === slug.slug) {
                return {
                    ...newsletter,
                    companies: newsletter.companies.filter(
                        (company: any) => company.company_id !== selectedCompanyId
                    )
                };
            }
            return newsletter;
        });

        // Update Redux state
        dispatch(setNewsletterData(updatedNewsletterData));
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
                {/* <AddCompanyCard /> */}
                {Array.isArray(activeNewsletterCompanyData?.companies) && activeNewsletterCompanyData?.companies.map((company) => (
                    <CompanyCard
                        key={company.company_id}
                        {...company}
                        alertId={slug.slug as string}
                        setIsDeleteModalOpen={(isOpen) => {
                            setSelectedCompanyId(company.company_id);
                            setIsDeleteModalOpen(isOpen);
                        }}
                        company_id={company.company_id}
                    />
                ))}
                {activeNewsletterCompanyData?.companies.length === 0 && (
                    <div className="col-span-full text-left mt-4 text-text-secondary">
                        There are no companies in the newsletter
                    </div>
                )}
            </div>

            {isDeleteModalOpen && (
                <DeleteCompanyModal
                    type="company"
                    id={selectedCompanyId}
                    onClose={() => {
                        setIsDeleteModalOpen(false);
                        setSelectedCompanyId('');
                    }}
                    onDelete={handleCompanyDelete}
                />
            )}
        </>
    )
}

export default Companies