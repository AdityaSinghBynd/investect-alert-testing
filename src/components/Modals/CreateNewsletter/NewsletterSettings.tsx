"use client";

import { useState } from "react";
import { NewsletterConfig } from "./index";
// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TimePicker } from "@/components/ui/dateAndTimePicker";
// Images
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
// Hooks
import { useNewsletterOperations } from "@/hooks/NewsletterOperations/useNewsletterOperations";
// Interfaces
interface NewsletterSettingsProps {
  initialValues: Pick<NewsletterConfig, "name" | "frequency" | "time">;
  onBack: () => void;
  onSubmit: (settings: Pick<NewsletterConfig, "name" | "frequency" | "time">) => void;
  isSubmitting?: boolean;
}

export default function NewsletterSettings({
  initialValues,
  onBack,
  onSubmit,
  isSubmitting = false
}: NewsletterSettingsProps) {
  const [settings, setSettings] = useState(initialValues);
  const { createNewsletter } = useNewsletterOperations();

  const handleChange = (field: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleFrequencyChange = (value: string) => {
    // Convert the tab value to proper frequency format
    const frequencyMap: { [key: string]: "Daily" | "Weekly" | "Monthly" } = {
      "daily": "Daily",
      "weekly": "Weekly",
      "monthly": "Monthly"
    };
    handleChange("frequency", frequencyMap[value]);
  };

  return (
    <section className="h-full flex flex-col justify-between gap-3">
      <div className="space-y-4 m-3 mt-2">

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
          <Tabs 
            defaultValue="daily" 
            value={settings.frequency.toLowerCase()}
            onValueChange={handleFrequencyChange}
            className="max-w-max"
          >
            <TabsList className='p-1 bg-[#eaf0fc] rounded-md gap-2'>
              <TabsTrigger value="daily" className='text-text-secondary text-sm font-normal rounded-md shadow-none border border-[#eaf0fc]'>Daily</TabsTrigger>
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
          <TimePicker
            id="time"
            value={settings.time}
            onChange={(value) => handleChange("time", value)}
            className="shadow-none border-[#eafofc] text-text-primary"
          />
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-[#eaf0fc] px-3 py-2">
        <Button variant="outline" className="text-text-primary border-[#eaf0fc] shadow-none hover:bg-[#eaf0fc]" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 text-text-primary" /> Back
        </Button>
        <Button
          onClick={() => onSubmit(settings)}
          disabled={!settings.name || !settings.frequency || !settings.time || isSubmitting}
          className="bg-[#004CE6] text-white border-none hover:bg-[#004CE6]/90 rounded-md"
        >
          {isSubmitting ? (
            <>Create <Loader2 className="h-4 w-4 ml-1 animate-spin" /></>
          ) : (
            <>Create <ArrowRight className="h-4 w-4 ml-1" /></>
          )}
        </Button>
      </div>

    </section>
  );
} 