"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AiChatSession } from "@/config/AiModal";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import moment from "moment";
import { Loader, Plus } from "lucide-react";
import ReactConfetti from "react-confetti";

const CreateForm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const PROMPT =
    ",On Basis of description create JSON form with formTitle, formHeading along with fieldName, FieldTitle, FieldType, Placeholder, label, required fields, and checkbox and select field type options will be in array only and in JSON format";

  const onCreateFrom = async () => {
    setLoading(true);

    try {
      const result = await AiChatSession.sendMessage(
        "Description:" + userInput + PROMPT
      );
      const responseText = await result.response.text();
      const fullName =
        user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.firstName || "Unknown User";
      if (responseText) {
        const resp = await db
          .insert(JsonForms)
          .values({
            jsonform: responseText,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD/MM/YYYY"),
            fullName: fullName,
          })
          .returning({ id: JsonForms.id });

        if (resp[0]?.id) {
          setShowConfetti(true);
          // Wait for 2 seconds to show confetti before redirecting
          setTimeout(() => {
            router.push("/my-forms/edit-form/" + resp[0].id);
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error creating form:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      {showConfetti && (
        <ReactConfetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={400}
          gravity={0.3}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}
      <Button onClick={() => setOpenDialog(true)}>
        Create Form <Plus />
      </Button>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white dark:bg-gray-900 dark:text-white border dark:border-gray-700">
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Write a description for your form below.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Textarea
              className="my-2 bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              placeholder="Write description for your form"
              onChange={(e) => setUserInput(e.target.value)}
              value={userInput}
            />
            <div className="flex gap-2 my-3 justify-end">
              <Button
                disabled={loading}
                onClick={onCreateFrom}
                className="dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                {loading ? (
                  <Loader className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-300" />
                ) : (
                  "Submit"
                )}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setOpenDialog(false)}
                className="dark:bg-red-700 dark:hover:bg-red-600"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateForm;
