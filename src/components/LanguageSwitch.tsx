import React from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function LanguageSwitch() {
  const t = useTranslations("language");
  const locale = useLocale();
  let imagePath;
  let otherLocale;
  if (locale === "de") {
    imagePath = "/united-kingdom.png";
    otherLocale = "/en/";
  } else {
    imagePath = "/germany.png";
    otherLocale = "/de/";
  }
  return (
    <div className="flex items-center p-4 text-sm italic">
      {t("changeText")}&nbsp;
      <Link href={otherLocale}>
        <Image src={imagePath} alt={t("altText")} width={35} height={35} />
      </Link>
    </div>
  );
}
