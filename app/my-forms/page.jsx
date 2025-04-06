"use client";
import React, { useEffect, useState } from "react";
import CreateForm from "./_components/CreateForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { desc, eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import MyFormCard from "../_components/MyFormCard";
import EmptyStatePlaceholder from "../_components/EmptyStatePlaceholder";
import { Loader } from "lucide-react";
import { ProtectedPage } from "../_components/Protected";

export default function MyFormsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [formList, setFormList] = useState([]);

  useEffect(() => {
    user && GetFormList();
  }, [user]);

  const GetFormList = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(JsonForms)
        .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(JsonForms.id));
      setFormList(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedPage>
      <section className="max-w-[1376px] mx-auto p-4 md:p-8 flex flex-col gap-8 min-h-screen overflow-hidden">
        <div className="flex flex-col md:items-center md:flex-row gap-4 md:gap-6">
          <div className="w-full inline-flex flex-col justify-start items-start gap-1">
            <h1 className="text-2xl md:text-3xl font-semibold break-words">
              My Forms
            </h1>
            <p className="text-base font-medium break-words text-muted-foreground">
              Recently created forms
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <CreateForm />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/templates")}
            >
              View Templates
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-300" />
          </div>
        ) : formList.length === 0 ? (
          <EmptyStatePlaceholder
            title={"No Forms Found"}
            description={"No forms found. Create a new form to get started."}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {formList.map((form, index) => (
              <MyFormCard
                key={index}
                formRecord={form}
                jsonForm={JSON.parse(form.jsonform)}
                redirectTo={`/my-forms/edit-form/${form.id}`}
              />
            ))}
          </div>
        )}
      </section>
    </ProtectedPage>
  );
}
