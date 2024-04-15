"use client";

import KeyboardComponent from "@/components/KeyboardComponent";
import { useLocale } from "next-intl";

function KeyboardgamePage() {
  const locale = useLocale();
  const resultUrl = "/" + locale + "/result";

  addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    if (key === "r") {
      window.location.href = resultUrl + "?selectedValue=Rock";
    }
    if (key === "p") {
      window.location.href = resultUrl + "?selectedValue=Paper";
    }
    if (key === "s") {
      window.location.href = resultUrl + "?selectedValue=Scissors";
    }
  });

  return (
    <div>
      <KeyboardComponent />;
    </div>
  );
}

export default KeyboardgamePage;
