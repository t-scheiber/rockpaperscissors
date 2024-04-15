import React from "react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer>
      <span className="font-semibold">
        {t("project")}&nbsp;&copy; Thomas Scheiber 2024
      </span>
    </footer>
  );
}
