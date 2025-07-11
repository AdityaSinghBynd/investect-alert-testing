"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import CompanySearch from "./CompanySearch";
import NewsletterSettings from "./NewsletterSettings";
import { X } from "lucide-react";
import { useFetchAllCompanies } from "@/hooks/Newsletter/useNewsletter";
import { useCreateNewsletter } from "@/hooks/NewsletterOperations/useNewsletterOperations";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "search" | "settings";

export interface Company {
  companyId: string;
  name: string;
  sector?: string;
  logo?: string;
  profiles?: {
    twitter?: string | null;
    website?: string | null;
    linkedin?: string | null;
    wikipedia?: string | null;
  };
}

export interface NewsletterConfig {
  companies: Company[];
  name: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  time: string;
}

const generateCronSpec = (frequency: string, time: string): string => {
  const [hours, minutes] = time.split(":").map(Number);
  
  switch (frequency.toLowerCase()) {
    case "daily":
      return `${minutes} ${hours} * * *`;
    case "weekly":
      return `${minutes} ${hours} * * 1`; // Monday
    case "monthly":
      return `${minutes} ${hours} 1 * *`; // 1st of every month
    default:
      return `${minutes} ${hours} * * *`; // Default to daily
  }
};

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const { data: session } = useSession();
  const [step, setStep] = useState<Step>("search");
  const [config, setConfig] = useState<NewsletterConfig>({
    companies: [],
    name: "",
    frequency: "Daily",
    time: "12:00"
  });

  const { data: companiesData, isLoading } = useFetchAllCompanies({
    enabled: isOpen, // Only fetch when modal is open
  });

  const createNewsletter = useCreateNewsletter();

  const handleCompanySelect = (companies: Company[]) => {
    setConfig(prev => ({ ...prev, companies }));
    setStep("settings");
  };

  const handleSettingsSubmit = async (settings: Pick<NewsletterConfig, "name" | "frequency" | "time">) => {
    if (!session?.user?.id || !session?.user?.email) {
      console.error("User session not found");
      return;
    }

    const cronSpec = generateCronSpec(settings.frequency, settings.time);
    
    try {
      await createNewsletter.mutateAsync({
        title: settings.name,
        cron_spec: cronSpec,
        user_id: session.user.id,
        companies: config.companies.map(company => ({
          company_id: company.companyId,
          context: ""
        })),
        email: session.user.email
      });
      
      onClose();
    } catch (error) {
      console.error("Failed to create newsletter:", error);
      // Handle error appropriately
    }
  };

  const handleBack = () => {
    if (step === "settings") {
      setStep("search");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-[#0026731A]/30 backdrop-blur-sm z-50"
      onClick={onClose}>
      <div
        className="fixed left-[50%] top-[40%] translate-x-[-50%] translate-y-[-50%] w-full h-full bg-layer-1 max-w-[650px] min-h-[400px] max-h-[400px] z-[70] rounded-lg shadow-custom-blue flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between rounded-t-lg border-b border-[#eaf0fc] py-2 px-3">
          <h2 className="text-md font-medium">Create newsletter</h2>
          <X className="h-5 w-5 cursor-pointer text-text-primary" onClick={onClose} />
        </header>

        <main className="p-3 flex-1 overflow-hidden">
          {step === "search" && (
            <CompanySearch
              selectedCompanies={config.companies}
              availableCompanies={companiesData?.companies || []}
              isLoading={isLoading}
              onSubmit={handleCompanySelect}
            />
          )}

          {step === "settings" && (
            <NewsletterSettings
              onBack={handleBack}
              initialValues={{
                name: config.name,
                frequency: config.frequency,
                time: config.time
              }}
              onSubmit={handleSettingsSubmit}
              isSubmitting={createNewsletter.isPending}
            />
          )}
        </main>
      </div>
    </div>
  );
}
