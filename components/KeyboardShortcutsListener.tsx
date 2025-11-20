"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  resultUrl: string;
};

export default function KeyboardShortcutsListener({ resultUrl }: Props) {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      let selectedValue: "Rock" | "Paper" | "Scissors" | null = null;
      if (key === "r") selectedValue = "Rock";
      if (key === "p") selectedValue = "Paper";
      if (key === "s") selectedValue = "Scissors";

      if (!selectedValue) {
        return;
      }

      router.push(`${resultUrl}?selectedValue=${selectedValue}`);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [resultUrl, router]);

  return null;
}

