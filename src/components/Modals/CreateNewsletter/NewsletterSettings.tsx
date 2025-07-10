"use client";

import { useState } from "react";
import { NewsletterConfig } from "./index";
// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// Images
import { ArrowLeft, ArrowRight } from "lucide-react";
// Hooks
import { useNewsletterOperations } from "@/hooks/NewsletterOperations/useNewsletterOperations";
// Interfaces
interface NewsletterSettingsProps {
  initialValues: Pick<NewsletterConfig, "name" | "frequency" | "time">;
  onBack: () => void;
  onSubmit: (settings: Pick<NewsletterConfig, "name" | "frequency" | "time">) => void;
}

export default function NewsletterSettings({
  initialValues,
  onBack,
  onSubmit
}: NewsletterSettingsProps) {
  const [settings, setSettings] = useState(initialValues);
  const { createNewsletter } = useNewsletterOperations();

  const handleChange = (field: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="h-full flex flex-col justify-between gap-3">
      <div className="space-y-4 pb-2">

        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-text-primary"
          >
            Name
          </label>
          <Input
            id="name"
            value={settings.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="IT & Telecom news"
            className="shadow-none border-[#eaf0fc] text-text-primary focus:ring-0 focus:border-[#004CE6] focus:outline-none placeholder:text-text-placeholder"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">
            Frequency
          </label>
          <Tabs defaultValue="daily" className="max-w-max">
            <TabsList className='p-1 bg-[#eaf0fc] rounded-md gap-2'>
              <TabsTrigger value="daily" className='text-text-secondary text-sm font-normal rounded-md shadow-none border border-[#eaf0fc]'>Daily</TabsTrigger>
              {/* <TabsTrigger value="bi-weekly" className='text-text-secondary text-sm font-normal rounded-md shadow-none border border-[#eaf0fc]'>Bi-weekly</TabsTrigger> */}
              <TabsTrigger value="weekly" className='text-text-secondary text-sm font-normal rounded-md shadow-none border border-[#eaf0fc]'>Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className='text-text-secondary text-sm font-normal rounded-md shadow-none border border-[#eaf0fc]'>Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2 max-w-max">
          <label
            htmlFor="time"
            className="text-sm font-medium text-text-primary"
          >
            Time
          </label>
          <Input
            id="time"
            type="time"
            value={settings.time}
            className="shadow-none border-[#eafofc] text-text-primary"
            onChange={(e) => handleChange("time", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-[#eaf0fc] pt-2">
        <Button variant="outline" className="text-text-primary border-[#eaf0fc] shadow-none hover:bg-[#eaf0fc]" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 text-text-primary" /> Back
        </Button>
        <Button
          onClick={() => onSubmit(settings)}
          disabled={!settings.name || !settings.frequency || !settings.time}
          className="bg-[#004CE6] text-white border-none hover:bg-[#004CE6]/90 rounded-md"
        >
          {createNewsletter.isPending ? "Creating..." : "Finish"} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

    </section>
  );
} 