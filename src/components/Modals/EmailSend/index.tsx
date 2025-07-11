"use client"

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CompanyWithNews } from '@/hooks/Newsletter/newsletter.interface';

interface SendEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    companiesWithNews: CompanyWithNews[];
    date: string;
}

const SendEmailModal = ({ isOpen, onClose, companiesWithNews, date }: SendEmailModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Send Email</h2>
                    <p className="text-sm text-gray-600 mb-2">Date: {date}</p>
                    <p className="text-sm text-gray-600 mb-4">
                        Companies: {companiesWithNews.filter(c => c.news?.length > 0).map(c => c.name).join(', ')}
                    </p>
                    {/* Add your email sending form/logic here */}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SendEmailModal;