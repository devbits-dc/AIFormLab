"use client";
import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export default function SignUpPage() {
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  // Define themes for light and dark mode
  const darkTheme = {
    baseTheme: "dark",
    variables: {
      colorPrimary: "#3b82f6",
      colorBackground: "#09090b",
      colorInputBackground: "#18181b",
      colorInputText: "#ffffff",
      colorText: "#ffffff",
    },
    elements: {
      card: "bg-zinc-950 shadow-2xl border border-zinc-800",
      formButtonPrimary: "bg-blue-500 hover:bg-blue-600 text-white",
      formFieldInput: "bg-zinc-900 border-zinc-700 text-white",
      footerActionLink: "text-blue-500 hover:text-blue-400",
      headerTitle: "text-white",
      headerSubtitle: "text-zinc-400",
      dividerLine: "bg-zinc-800",
      dividerText: "text-zinc-500",
      formFieldLabel: "text-zinc-300",
      formFieldHintText: "text-zinc-500",
      identityPreviewText: "text-zinc-300",
      formFieldSuccessText: "text-green-500",
      formFieldErrorText: "text-red-500",
      socialButtonsIconButton:
        "bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-white",
      socialButtonsBlockButton:
        "bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-white",

      navbar: "hidden",
      headerBackIcon: "text-zinc-300",
      headerBackLink: "text-zinc-300 hover:text-zinc-100",
    },
  };

  const lightTheme = {
    baseTheme: "light",
    variables: {
      colorPrimary: "#3b82f6",
      colorBackground: "#ffffff",
      colorInputBackground: "#f3f4f6",
      colorInputText: "#000000",
      colorText: "#1f2937",
    },
    elements: {
      card: "bg-white shadow-2xl border border-gray-300",
      formButtonPrimary: "bg-blue-500 hover:bg-blue-600 text-white",
      formFieldInput: "bg-gray-100 border-gray-300 text-black",
      footerActionLink: "text-blue-500 hover:text-blue-400",
      headerTitle: "text-gray-900",
      headerSubtitle: "text-gray-600",
      dividerLine: "bg-gray-300",
      dividerText: "text-gray-500",
      formFieldLabel: "text-gray-700",
      formFieldHintText: "text-gray-500",
      identityPreviewText: "text-gray-700",
      formFieldSuccessText: "text-green-500",
      formFieldErrorText: "text-red-500",
      socialButtonsIconButton:
        "bg-gray-100 border-gray-300 hover:bg-gray-200 text-black",
      socialButtonsBlockButton:
        "bg-gray-100 border-gray-300 hover:bg-gray-200 text-black",

      navbar: "hidden",
      headerBackIcon: "text-gray-700",
      headerBackLink: "text-gray-700 hover:text-gray-900",
    },
  };

  return (
    <div
      className={`min-h-screen ${
        currentTheme === "dark" ? "bg-black" : "bg-gray-100"
      }`}
    >
      <div
        className="flex items-center justify-center min-h-[calc(100vh-60px)]" // Adjust height to avoid header overlap
      >
        <SignUp appearance={currentTheme === "dark" ? darkTheme : lightTheme} />
      </div>
    </div>
  );
}
