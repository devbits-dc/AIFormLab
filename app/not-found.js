"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center w-full h-screen flex-col gap-6 px-4 text-center overflow-hidden">
            <Image
                src="/logo-icon.svg"
                alt="App Logo"
                width={100}
                height={100}
                className="mb-4"
                priority
            />
            <h1 className="text-4xl font-bold">404 - Not Found</h1>
            <p className="text-lg text-gray-500">Looks like you've hit a dead end.</p>
            <div className="flex gap-4 mt-4">
                <Button
                    onClick={() => router.back()}
                    className=" text-white px-4 py-2 rounded  transition"
                >
                    Go Back
                </Button>
                <Link href="/">
                    <Button className=" text-white px-4 py-2 rounded transition">
                        Go Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
