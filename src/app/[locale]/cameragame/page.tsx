import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import WebcamAIComponent from "@/components/WebcamAIComponent";

export default function Game() {
  const t = useTranslations("cameragame");
  const locale = useLocale();
  const resultUrl = `/${locale}/cameraresult`;

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <p className="text-lg">{t("descriptionA")}</p>
        <p className="text-lg">{t("descriptionB")}</p>
        <p className="text-lg">{t("descriptionC")}</p>
        <div>
          <WebcamAIComponent />
        </div>
      </div>
    </div>
  );
}
