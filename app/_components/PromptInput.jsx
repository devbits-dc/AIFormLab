"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { db } from "@/config";
import { JsonForms } from "@/config/schema";
import { AiChatSession } from "@/config/AiModal";
import moment from "moment";
import ReactConfetti from "react-confetti";

const PromptInput = ({ prompt: initialPrompt = "" }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const maxLength = 500;
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const PROMPT =
    ",On Basis of description create JSON form with formTitle, formHeading along with fieldName, FieldTitle, FieldType, Placeholder, label, required fields, and checkbox and select field type options will be in array only and in JSON format";

  const handleSubmit = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!prompt.trim()) return;
    setIsLoading(true);

    try {
      const result = await AiChatSession.sendMessage(
        "Description:" + prompt + PROMPT
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

    setIsLoading(false);
  };

  return (
    <div className="w-full">
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
      <div className="bg-primary px-1 pb-1 pt-4 rounded-2xl">
        <div className="p-4 rounded-xl bg-background">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the form you want to create. For example: Create a job application form with fields for personal information, work experience, education, and references."
              className="w-full min-h-[100px] border-none outline-none resize-none bg-transparent text-base text-muted-foreground placeholder:text-muted-foreground/50 focus:ring-0"
              maxLength={maxLength}
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground/50">
              {prompt.length}/{maxLength}
            </div>
          </div>
          <div className="w-full flex justify-end mt-4">
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Form"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
