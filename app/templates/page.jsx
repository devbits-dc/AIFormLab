"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { useRouter } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { Search, Loader } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import TemplateList from "./_comonents/TemplateList";
import Image from "next/image";

const Templates = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="p-8 flex flex-col gap-8">
      <div className="flex items-center w-full gap-8">
        <div className="w-full inline-flex flex-col justify-start items-start gap-1">
          <h1 className="text-3xl font-semibold break-words">Templates</h1>
          <p className="text-base font-medium break-words text-muted-foreground">
          Recently Created Templates
          </p>
        </div>
        <div className="flex gap-2 px-3 py-2 border rounded-md bg-white w-full">
            <Image src={'/search.svg'} alt="search" width={24} height={24} />
            <input
                className="text-sm font-normal break-words border-none outline-none w-full"
                placeholder="Search Templates eg. “Cricket form”"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>
      <TemplateList columns={4} searchQuery={searchQuery} />
    </div>
  );
};

export default Templates;

{
  /* <h1 className="font-bold text-3xl">Templates</h1>
<div className="relative">
    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
    <Input
        className="pl-10 w-80"
        placeholder="Search templates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
    />
</div> */
}

