import Link from "next/link";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import LanguageSwitch from "./LanguageSwitch";

export default async function Header() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("header"),
  ]);

  const rootUrl = `/${locale}`;
  const mouseUrl = `${rootUrl}/mousegame`;
  const keyboardUrl = `${rootUrl}/keyboardgame`;
  const aiUrl = `${rootUrl}/cameragame`;

  return (
    <header className="align-center container mx-auto flex h-[10vh] items-center justify-around text-2xl">
      <div className="align-center">
        <Link href={rootUrl} className="flex">
          <div className="align-center flex justify-between">
            <div>
              <Image src="/logo.png" width={65} height={65} alt="Logo" />
            </div>
            <h1 className="ml-2 flex items-center font-semibold">
              {t("title")}
            </h1>
          </div>
        </Link>
      </div>
      <nav className="flex flex-row justify-center">
        <div className="flex flex-row justify-center gap-1">
          <Link href={mouseUrl} className="p-4">
            {t("mouseText")}
          </Link>
          <Link href={keyboardUrl} className="p-4">
            {t("keyboardText")}
          </Link>
          <Link href={aiUrl} className="p-4">
            {t("cameraText")}
          </Link>
        </div>
        <LanguageSwitch />
      </nav>
    </header>
  );
}
