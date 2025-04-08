"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import TemplateList from "../templates/_comonents/TemplateList";
import PromptInput from "./PromptInput";

const promptMessage = [
  {
    id: 1,
    prompt:
      "Create a job application form with fields for personal information, work experience, education, and references.",
    title: "Job Application",
  },
  {
    id: 2,
    prompt:
      "Create a registration form with fields for name, email, password, and profile picture.",
    title: "Registration Form",
  },
  {
    id: 3,
    prompt:
      "Create a course exit form with fields for student details, course completion status, and feedback.",
    title: "Course Exit Form",
  },
  {
    id: 4,
    prompt:
      "Create a feedback form with fields for rating, comments, and contact information.",
    title: "Feedback Form",
  },
  {
    id: 5,
    prompt:
      "Create a customer support form with fields for issue description, priority level, and contact details.",
    title: "Customer Support Form",
  },
];

const Hero = () => {
  const router = useRouter();
  const [selectedPrompt, setSelectedPrompt] = useState("");

  return (
    <section className="max-w-[1376px] mx-auto p-4 md:p-8">
      <div className="flex items-center justify-center flex-col gap-4 md:gap-8 max-w-4xl min-h-screen mx-auto">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex flex-col gap-8 items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <Image
                src={"/logo-icon.svg"}
                className="rotate-6"
                alt="logo"
                width={64}
                height={64}
              />
              <h1 className="text-4xl md:text-5xl font-semibold max-w-xl text-center">
                Create a AI Form with
                <span className="text-primary"> Formify</span> in Minutes
              </h1>
            </div>
            <PromptInput prompt={selectedPrompt} />
          </div>
          <div className="flex flex-row justify-center flex-wrap gap-4 items-center w-full">
            {promptMessage.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className="rounded-xl"
                onClick={() => setSelectedPrompt(item.prompt)}
              >
                {item.title}
              </Button>
            ))}
          </div>
        </div>

        <div className="py-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-base font-semibold">
              Recently created Templates
            </h1>
            <Button
              variant="outline"
              className="border-none"
              onClick={() => {
                router.push("/templates");
              }}
            >
              View More
            </Button>
          </div>
          <TemplateList columns={3} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
