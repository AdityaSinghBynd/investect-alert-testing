"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
// Images
import { ArrowRight, X } from "lucide-react";
// Components
import { Company } from "./index";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CompanySearchProps {
  selectedCompanies: Company[];
  availableCompanies: Company[];
  isLoading: boolean;
  onSubmit: (companies: Company[]) => void;
}

export default function CompanySearch({ 
  selectedCompanies, 
  availableCompanies,
  isLoading,
  onSubmit 
}: CompanySearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>(selectedCompanies);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter companies based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCompanies([]);
      setIsDropdownOpen(false);
      return;
    }

    const filtered = availableCompanies.filter(company => 
      company.name.toLowerCase().includes(query.toLowerCase()) &&
      !companies.some(c => c.companyId === company.companyId)
    );
    setFilteredCompanies(filtered);
    setIsDropdownOpen(true);
  };

  const handleCompanySelect = (company: Company) => {
    if (!companies.find(c => c.companyId === company.companyId)) {
      setCompanies([...companies, company]);
      setSearchQuery('');
      setFilteredCompanies([]);
      setIsDropdownOpen(false);
    }
  };

  const handleCompanyRemove = (companyId: string) => {
    setCompanies(companies.filter(c => c.companyId !== companyId));
  };

  // const handleAttachExcel = () => {
  //   // Implement Excel file attachment logic
  // };

  // const handleSourceToggle = (sourceId: string) => {
  //   // Implement source toggle logic
  // };

  return (
    <section className="flex flex-col h-full space-y-2">
      <div className="relative" ref={dropdownRef}>
        <Input
          type="text"
          placeholder="Search your companies"
          value={searchQuery}
          className="w-full h-10 border-[#eaf0fc] focus:border-[#004CE6] focus:ring-1 focus:ring-[#004CE6] focus:outline-none placeholder:text-text-placeholder shadow-none"
          onChange={(e) => handleSearch(e.target.value)}
          disabled={isLoading}
        />
        
        {/* Dropdown for search results */}
        {isDropdownOpen && filteredCompanies.length > 0 && (
          <div className="absolute w-full mt-1 bg-layer-1 border border-[#eaf0fc] rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
            {filteredCompanies.map((company) => (
              <div
                key={company.companyId}
                className="flex items-center gap-2 p-3 hover:bg-[#f7f9fe] cursor-pointer transition-colors"
                onClick={() => handleCompanySelect(company)}
              >
                <Image
                  src={company.logo || "/ByndLogoFavicon.svg"}
                  alt={company.name}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-sm">{company.name}</h3>
                  <p className="text-xs text-text-placeholder">{company.sector}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-layer-2 rounded-lg p-3">
        {companies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {companies.map((company) => (
              <div
                key={company.companyId}
                className="flex items-center justify-between rounded-lg border border-[#eaf0fc] bg-layer-1 px-3 py-2 max-w-max gap-2"
              >
                <Image
                  src={company.logo || "/ByndLogoFavicon.svg"}
                  alt={company.name}
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-sm">{company.name}</h3>
                </div>

                <X 
                  className="h-4 w-4 text-text-secondary cursor-pointer" 
                  onClick={() => handleCompanyRemove(company.companyId)} 
                />
              </div>
            ))}
          </div>
        )}

        {companies.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <Image
              src="/images/noDocument.svg"
              alt="No companies"
              width={180}
              height={180}
            />
            <p className="text-center text-text-placeholder text-sm">
              {isLoading ? "Loading companies..." : "Nothing added yet"}
            </p>
          </div>
        )}
      </div>

      {/* {companies.length > 0 && (
        <div className="p-3 flex flex-col gap-2">
          <p className="text-sm text-text-primary font-medium">We will track following sources</p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SOURCES.map((source) => (
              <div
                key={source.id}
                className="flex items-center p-1 gap-2 border border-[#eaf0fc] shadow-none max-w-max rounded-md hover:bg-[#f7f9fe] cursor-pointer"
              >
                <Checkbox
                  id={source.id}
                  checked={sources.includes(source.id)}
                  onCheckedChange={() => handleSourceToggle(source.id)}
                  className="border-[#eaf0fc] shadow-none data-[state=checked]:bg-[#004CE6] data-[state=checked]:text-white"
                />
                <p className="text-sm font-normal text-text-primary">
                  {source.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#eaf0fc] pt-2 w-full">
        <p className="text-sm text-[#004CE6] font-medium">
          {companies.length} selected
        </p>
        <Button
          className="bg-[#004CE6] text-white border-none hover:bg-[#004CE6]/90 rounded-md"
          disabled={companies.length === 0}
          onClick={() => onSubmit(companies)}
        >
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

    </section>
  );
} 