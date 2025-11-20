import Image from "next/image";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

export default async function LanguageSwitch() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("language"),
  ]);

  const isGerman = locale === "de";
  const otherLocale = isGerman ? "en" : "de";
  const imagePath = isGerman ? "/united-kingdom.png" : "/germany.png";

  return (
    <div className="flex items-center p-4 text-sm italic">
      {t("changeText")}&nbsp;
      <Link href={`/${otherLocale}`}>
        <Image src={imagePath} alt={t("altText")} width={35} height={35} />
      </Link>
    </div>
  );
}
