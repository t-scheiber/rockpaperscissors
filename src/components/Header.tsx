import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useLocale, useTranslations } from "next-intl";
import LanguageSwitch from "./LanguageSwitch";

export default function Header() {
  const locale = useLocale();
  const t = useTranslations("header");
  const mouseUrl = "/" + locale + "/mousegame";
  const keyboardUrl = "/" + locale + "/keyboardgame";
  const aiUrl = "/" + locale + "/cameragame";

  return (
    <header className="align-center container mx-auto flex h-[10vh] items-center justify-around text-2xl">
      <div className="align-center">
        <Link href="/" className="flex">
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
