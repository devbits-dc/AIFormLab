"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export function ProtectedPage({ children }) {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>{children}</SignedIn>
    </>
  );
}