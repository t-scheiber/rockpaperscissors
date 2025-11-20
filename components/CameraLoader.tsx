"use client";

import { useTranslations } from "next-intl";

export default function CameraLoader() {
  const t = useTranslations("cameragame");

  return (
    <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
      <p>{t("loadingCamera")}</p>
    </div>
  );
}

