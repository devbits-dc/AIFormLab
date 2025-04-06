"use client";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { desc, eq } from "drizzle-orm";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import FormUi from "@/app/my-forms/edit-form/_components/FormUi";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import TemplateCard from "@/app/_components/TemplateCard";
import EmptyStatePlaceholder from "@/app/_components/EmptyStatePlaceholder";
// import TemplateCard from "./TemplateCard";

const TemplateList = ({ columns, searchQuery }) => {
  const [templateList, setTemplateList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewForm, setPreviewForm] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    getTemplatesList();
  }, []);

  const getTemplatesList = async () => {
    setLoading(true);
    try {
      const result = await db
        .select()
        .from(JsonForms)
        .where(eq(JsonForms.isTemplate, true)) // Fetch only templates
        .orderBy(desc(JsonForms.id));

      setTemplateList(result);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Something went wrong while fetching templates.");
    }
    setLoading(false);
  };
  // search logic

  const trimmedQuery = searchQuery?.trim().toLowerCase();
  const filteredTemplates = !trimmedQuery
    ? templateList
    : templateList.filter((template) => {
        const formTitle = JSON.parse(template.jsonform)?.formTitle || "";
        return formTitle.toLowerCase().includes(trimmedQuery);
      });
  const openPreview = (template) => {
    setPreviewForm(template);
    setIsPreviewOpen(true);
  };

  const handleUseTemplate = async (template) => {
    setLoading(true);
    try {
      const fullName =
        user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.firstName || "Unknown User";
      const result = await db
        .insert(JsonForms)
        .values({
          jsonform: template.jsonform,
          theme: template.theme,
          background: template.background,
          style: template.style,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD/MM/YYYY"),
          fullName: fullName,
        })
        .returning({ id: JsonForms.id });

      if (result[0]?.id) {
        toast.success("Template used successfully!");
        router.push("/my-forms");
      } else {
        toast.error("Failed to use the template. Please try again.");
      }
    } catch (error) {
      console.error("Error while using template:", error);
      toast.error("Something went wrong while using the template.");
    }
    setLoading(false);
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-20">
          <Loader className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-300" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <EmptyStatePlaceholder
          title="No templates found"
          description={
            searchQuery
              ? `No templates matching "${searchQuery}"`
              : "No templates available at the moment"
          }
        />
      ) : (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
          } gap-4 md:gap-6`}
        >
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              template={template}
              key={index}
              index={index}
              handleUseTemplate={handleUseTemplate}
              openPreview={openPreview}
            />
          ))}
          {/* {templateList.map((template, index) => <TemplateCard template={template} key={index} index={index} handleUseTemplate={handleUseTemplate} openPreview={openPreview} />)} */}
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="w-full max-w-4xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {previewForm?.formTitle || "Form Preview"}
            </DialogTitle>
          </DialogHeader>
          <div
            className="md:col-span-2 border rounded-lg p-5 flex items-center justify-center dark:border-gray-700"
            style={{ background: previewForm?.background }}
          >
            <FormUi
              jsonForm={
                previewForm?.jsonform ? JSON.parse(previewForm.jsonform) : null
              }
              selectedStyle={
                previewForm?.style ? JSON.parse(previewForm?.style) : null
              }
              selectedTheme={previewForm?.theme}
              editable={false}
              formId={previewForm?.id}
              enabledSignIn={previewForm?.enabledSignIn}
              isTemplateCard={true}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TemplateList;
