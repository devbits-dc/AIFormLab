"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import TemplateList from "./_comonents/TemplateList";

const Templates = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="max-w-[1376px] mx-auto p-4 md:p-8 flex flex-col gap-8 min-h-screen overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold break-words">Templates</h1>
          <p className="text-base font-medium break-words text-muted-foreground">
            Recently Created Templates
          </p>
        </div>
        <div className="relative w-80 ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-10 pr-4 py-2 w-full border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
            placeholder='Search Templates e.g. "Cricket form"'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <TemplateList columns={4} searchQuery={searchQuery} />
    </section>
  );
};

export default Templates;
