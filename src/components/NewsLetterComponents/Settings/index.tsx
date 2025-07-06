'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
// Components
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Redux
import { RootState } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveNewsletter } from '@/redux/Newsletter/newsletterSlice';
// Utils
import { getCronFrequency, generateCronExpression, FrequencyType } from '@/utils/cronUtils';
// Hooks
import { useNewsletterOperations } from '@/hooks/NewsletterOperations/useNewsletterOperations';
import { useFetchSingleNewsletterData } from '@/hooks/Newsletter/useNewsletter';

interface NewsletterChanges {
    frequency: FrequencyType;
    title: string;
    email: string;
    hasChanges: boolean;
}

const Settings = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { activeNewsletter } = useSelector((state: RootState) => state.newsletter);
    const { createNewsletter, deleteNewsletter } = useNewsletterOperations();
    const { data: newsletterData } = useFetchSingleNewsletterData(activeNewsletter?.alert_id || '');

    // Get initial frequency from cron expression
    const initialFrequency = getCronFrequency(activeNewsletter?.cron_spec || '');

    // State to track changes
    const [changes, setChanges] = useState<NewsletterChanges>({
        frequency: initialFrequency,
        title: activeNewsletter?.title || '',
        email: activeNewsletter?.email || '',
        hasChanges: false
    });

    // Reset changes when activeNewsletter changes
    useEffect(() => {
        setChanges({
            frequency: getCronFrequency(activeNewsletter?.cron_spec || ''),
            title: activeNewsletter?.title || '',
            email: activeNewsletter?.email || '',
            hasChanges: false
        });
    }, [activeNewsletter?.alert_id]);

    const handleFrequencyChange = (newFrequency: FrequencyType) => {
        setChanges(prev => ({
            ...prev,
            frequency: newFrequency,
            hasChanges: newFrequency !== initialFrequency ||
                prev.title !== activeNewsletter?.title ||
                prev.email !== activeNewsletter?.email
        }));
    };

    const handleInputChange = (field: 'title' | 'email', value: string) => {
        setChanges(prev => ({
            ...prev,
            [field]: value,
            hasChanges: value !== (activeNewsletter?.[field] || '') ||
                prev.frequency !== initialFrequency ||
                (field === 'title' ? prev.email !== activeNewsletter?.email : prev.title !== activeNewsletter?.title)
        }));
    };

    const handleUpdateNewsletter = async () => {
        if (!activeNewsletter || !changes.hasChanges || !newsletterData) return;

        try {
            // Generate new cron expression based on selected frequency
            const newCronSpec = generateCronExpression({
                frequency: changes.frequency,
                // Extract current hour and minute from existing cron if available
                ...(activeNewsletter.cron_spec ? {
                    hour: parseInt(activeNewsletter.cron_spec.split(' ')[1]),
                    minute: parseInt(activeNewsletter.cron_spec.split(' ')[0])
                } : {})
            });

            const payload = {
                cron_spec: newCronSpec,
                user_id: activeNewsletter.user_id,
                company_ids: newsletterData.companies.map(company => company.company_id),
                email: changes.email,
                alert_id: activeNewsletter.alert_id,
                title: changes.title
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

    const handleDeleteNewsletter = async () => {
        if (!activeNewsletter) return;

        try {
            deleteNewsletter.mutate({
                userID: activeNewsletter.user_id,
                newsletterID: activeNewsletter.alert_id
            }, {
                onSuccess: () => {
                    dispatch(setActiveNewsletter(null));
                    router.push('/');
                },
                onError: (error) => {
                    console.error('Failed to delete newsletter:', error);
                }
            });
        } catch (error) {
            console.error('Failed to delete newsletter:', error);
        }
    }

    return (
        <main className='flex flex-col gap-4 mt-6'>
            {/* Newsletter name */}
            <div className='flex flex-col gap-2'>
                <label htmlFor="name" className='text-[#4e5971] text-sm font-medium'>Newsletter name</label>
                <Input
                    id="name"
                    type="text"
                    value={changes.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-[300px] px-3 py-2.5 text-[16px] text-[#001742] border border-[#EAF0FC] rounded-sm focus:ring-1 focus:ring-[#004CE6] focus:border-[#004CE6] focus:outline-none placeholder:text-[#9babc7] shadow-none"
                    placeholder="Your newsletter name"
                />
            </div>

            {/* Delivery frequency */}
            <div className='flex flex-col gap-2'>
                <label htmlFor="name" className='text-[#4e5971] text-sm font-medium'>Delivery frequency</label>
                <Tabs value={changes.frequency} onValueChange={handleFrequencyChange} className="max-w-max flex flex-col gap-1">
                    <TabsList className='p-1 bg-[#eaf0fc] rounded-md gap-2'>
                        <TabsTrigger value="daily" className='text-[#4e5971] text-sm font-normal rounded-md shadow-none border border-[#eaf0fc]'>Daily</TabsTrigger>
                        {/* <TabsTrigger value="bi-weekly" className='text-[#4e5971] text-sm font-normal rounded-md shadow-none border border-[#eaf0fc]'>Bi-weekly</TabsTrigger> */}
                        <TabsTrigger value="weekly" className='text-[#4e5971] text-sm font-normal rounded-md shadow-none border border-[#eaf0fc]'>Weekly</TabsTrigger>
                        <TabsTrigger value="monthly" className='text-[#4e5971] text-sm font-normal rounded-md shadow-none border border-[#eaf0fc]'>Monthly</TabsTrigger>
                    </TabsList>

                    <span className='text-[#9babc7] text-xs font-normal'>
                        Daily delivery at {activeNewsletter?.cron_spec ? `${activeNewsletter.cron_spec.split(' ')[1]}:${activeNewsletter.cron_spec.split(' ')[0]}` : '3:00pm'}
                    </span>
                </Tabs>
            </div>

            {/* Delivery email */}
            <div className='flex flex-col gap-2'>
                <label htmlFor="email" className='text-[#4e5971] text-sm font-medium'>Delivery email</label>
                <Input
                    id="email"
                    type="email"
                    value={changes.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-[300px] px-3 py-2.5 text-[16px] text-[#001742] border border-[#EAF0FC] rounded-sm focus:ring-1 focus:ring-[#004CE6] focus:border-[#004CE6] focus:outline-none placeholder:text-[#9babc7] shadow-none"
                    placeholder="Your delivery email"
                />
            </div>

            {/* Update newsletter button */}
            <div className='flex gap-2'>
                <Button
                    variant='default'
                    onClick={handleUpdateNewsletter}
                    disabled={!changes.hasChanges || createNewsletter.status === 'pending' || !newsletterData}
                    className='w-max bg-[#004CE6] text-white border-none hover:bg-[#004CE6]/90 mt-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {createNewsletter.status === 'pending' ? 'Updating...' : 'Update Newsletter'}
                </Button>

                <Button
                    variant='default'
                    onClick={handleDeleteNewsletter}
                    className='w-max bg-[#FF0000] text-white border-none hover:bg-[#FF0000]/90 mt-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {deleteNewsletter.status === 'pending' ? 'Deleting...' : 'Delete Newsletter'}
                </Button>
            </div>
        </main>
    )
}

export default Settings;