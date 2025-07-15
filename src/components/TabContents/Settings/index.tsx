'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { SessionUser } from '@/types/sessionUser';
import { useParams } from 'next/navigation';
// Components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import DeleteNewsletterModal from '@/components/Modals/Actions/Delete';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Redux
import { RootState } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveNewsletter } from '@/redux/Newsletter/newsletterSlice';
// Utils
import { getCronFrequency, generateCronExpression, FrequencyType } from '@/utils/cronUtils';
// Hooks
import { useNewsletterOperations } from '@/hooks/NewsletterOperations/useNewsletterOperations';

interface NewsletterChanges {
    frequency: FrequencyType;
    title: string;
    email: string;
    hasChanges: boolean;
}


const Settings = () => {
    const { data: session } = useSession();
    const user = session?.user as SessionUser;
    const slug = useParams();
    const dispatch = useDispatch();
    const { newsletterData } = useSelector((state: RootState) => state.newsletter);
    const activeNewsletterData = newsletterData?.find((newsletter) => newsletter.alert?.alert_id === slug.slug);
    const { createNewsletter } = useNewsletterOperations();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    console.log("activeNewsletterData", activeNewsletterData)
    // Get initial frequency from cron expression
    const initialFrequency = getCronFrequency(activeNewsletterData?.alert?.cron_spec || '');

    // State to track changes
    const [changes, setChanges] = useState<NewsletterChanges>({
        frequency: initialFrequency,
        title: activeNewsletterData?.alert?.title || '',
        email: activeNewsletterData?.alert?.email || '',
        hasChanges: false
    });

    // Reset changes when activeNewsletter changes
    useEffect(() => {
        setChanges({
            frequency: getCronFrequency(activeNewsletterData?.alert?.cron_spec || ''),
            title: activeNewsletterData?.alert?.title || '',
            email: activeNewsletterData?.alert?.email || '',
            hasChanges: false
        });
    }, [activeNewsletterData?.alert_id]);

    const handleFrequencyChange = (newFrequency: FrequencyType) => {
        setChanges(prev => ({
            ...prev,
            frequency: newFrequency,
            hasChanges: newFrequency !== initialFrequency ||
                prev.title !== activeNewsletterData?.alert?.title ||
                prev.email !== activeNewsletterData?.alert?.email
        }));
    };

    const handleInputChange = (field: 'title' | 'email', value: string) => {
        setChanges(prev => ({
            ...prev,
            [field]: value,
            hasChanges: value !== (activeNewsletterData?.alert?.[field] || '') ||
                prev.frequency !== initialFrequency ||
                (field === 'title' ? prev.email !== activeNewsletterData?.alert?.email : prev.title !== activeNewsletterData?.alert?.title)
        }));
    };

    const handleUpdateNewsletter = async () => {
        if (!activeNewsletterData || !changes.hasChanges || !newsletterData) return;

        try {
            // Generate new cron expression based on selected frequency
            const newCronSpec = generateCronExpression({
                frequency: changes.frequency,
                // Extract current hour and minute from existing cron if available
                ...(activeNewsletterData.alert.cron_spec ? {
                    hour: parseInt(activeNewsletterData.alert.cron_spec.split(' ')[1]),
                    minute: parseInt(activeNewsletterData.alert.cron_spec.split(' ')[0])
                } : {})
            });

            const payload = {
                cron_spec: newCronSpec,
                user_id: user?.id,
                companies: activeNewsletterData.companies.map(company => ({
                    company_id: company.company_id,
                    context: ""
                })),
                email: changes.email || user?.email,
                alert_id: activeNewsletterData.alert?.alert_id,
                title: changes.title || activeNewsletterData?.alert?.title
            };

            createNewsletter.mutate(payload, {
                onSuccess: (updatedNewsletter) => {
                    dispatch(setActiveNewsletter(updatedNewsletter));
                    setChanges(prev => ({ ...prev, hasChanges: false }));
                },
                onError: (error) => {
                    console.error('Failed to update newsletter:', error);
                    // Handle error (you might want to show a toast notification here)
                }
            });
        } catch (error) {
            console.error('Failed to update newsletter:', error);
        }
    };

    return (
        <>
            <main className='flex flex-col gap-4 max-w-2xl mr-auto'>

                <div className='flex flex-col gap-2 w-full space-y-3'>

                    <div className='flex items-end justify-between gap-2 border-b border-[#EAF0FC] pb-3 h-[40px]'>
                        <h2 className='text-lg font-medium text-text-primary'>Newsletter settings</h2>

                        {changes.hasChanges && (
                            <Button
                                variant='default'
                                onClick={handleUpdateNewsletter}
                                className='w-max bg-button-primary font-semibold text-sm text-white border-none hover:bg-[#004CE6]/90 rounded-md px-3 py-1 shadow-none'
                            >
                                {createNewsletter.status === 'pending' ? 'Updating...' : 'Update'}
                            </Button>
                        )}
                    </div>

                    {/* Newsletter name */}
                    <div className='flex items-center justify-between gap-2'>
                        <label htmlFor="name" className='text-text-primary text-sm font-medium'>Newsletter name</label>
                        <Input
                            id="name"
                            type="text"
                            value={changes.title || activeNewsletterData?.alert?.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-[300px] px-3 py-2.5 text-[16px] text-text-primary border border-[#EAF0FC] rounded-sm focus:ring-1 focus:ring-[#004CE6] focus:border-[#004CE6] focus:outline-none placeholder:text-text-placeholder shadow-none"
                            placeholder="Your newsletter name"
                        />
                    </div>

                    {/* Delivery frequency */}
                    <div className='flex items-center justify-between gap-2'>
                        <label htmlFor="name" className='text-text-primary text-sm font-medium'>Delivery frequency</label>
                        <Tabs value={changes.frequency} onValueChange={handleFrequencyChange} className="max-w-max flex flex-col gap-1">
                            <TabsList className='p-1 bg-[#eaf0fc] rounded-md gap-2'>
                                <TabsTrigger value="daily" className='text-text-placeholder text-sm font-normal rounded-md shadow-none border border-[#eaf0fc]'>Daily</TabsTrigger>
                                {/* <TabsTrigger value="bi-weekly" className='text-text-placeholder text-sm font-normal rounded-md shadow-none border border-[#eaf0fc]'>Bi-weekly</TabsTrigger> */}
                                <TabsTrigger value="weekly" className='text-text-placeholder text-sm font-normal rounded-md shadow-none border border-[#eaf0fc]'>Weekly</TabsTrigger>
                                <TabsTrigger value="monthly" className='text-text-placeholder text-sm font-normal rounded-md shadow-none border border-[#eaf0fc]'>Monthly</TabsTrigger>
                            </TabsList>

                            {/* <span className='text-text-placeholder text-xs font-normal'>
                            Daily delivery at {activeNewsletterData?.cron_spec ? `${activeNewsletterData.cron_spec.split(' ')[1]}:${activeNewsletterData.cron_spec.split(' ')[0]}` : '3:00pm'}
                        </span> */}
                        </Tabs>
                    </div>

                    {/* Delivery email */}
                    <div className='flex items-center justify-between gap-2'>
                        <label htmlFor="email" className='text-text-primary text-sm font-medium'>Delivery email</label>
                        <Input
                            id="email"
                            type="email"
                            value={changes.email || user?.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-[300px] px-3 py-2.5 text-[16px] text-text-primary border border-[#EAF0FC] rounded-sm focus:ring-1 focus:ring-[#004CE6] focus:border-[#004CE6] focus:outline-none placeholder:text-text-placeholder shadow-none"
                            placeholder="Your delivery email"
                        />
                    </div>

                    {/* Delete newsletter */}
                    <div className='flex items-center justify-between gap-2 mt-3 bg-layer-2 border border-primary hover:border-secondary rounded-md p-3'>

                        <div className='flex flex-col'>
                            <h3 className='text-text-primary text-sm font-medium'>Delete newsletter</h3>
                            <p className='text-text-secondary text-xs font-normal'>Permanently delete this newsletter and all associated data.</p>
                        </div>

                        <Button
                            variant='destructive'
                            onClick={() => setIsDeleteModalOpen(true)}
                            className='w-max bg-[#FF0000] font-semibold px-3 py-1 text-sm text-red-500 bg-layer-1 border border-[#eaf0fc] hover:bg-[#FF0000] hover:text-white rounded-md shadow-none'
                        >
                            Delete
                        </Button>
                    </div>

                </div>
            </main>

            {/* Delete Newsletter Modal */}
            {isDeleteModalOpen && (
                <DeleteNewsletterModal
                    onClose={() => setIsDeleteModalOpen(false)}
                    type="newsletter"
                    id={activeNewsletterData?.alert?.alert_id}
                />
            )}
        </>
    )
}

export default Settings;