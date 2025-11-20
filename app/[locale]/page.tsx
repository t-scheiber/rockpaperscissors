import Link from "next/link";
import Image from "next/image";
import mouseImage from "@/public/mouse.png";
import keyboardImage from "@/public/keyboard.png";
import cameraImage from "@/public/camera.png";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Index() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("home"),
  ]);
  const localePrefix = `/${locale}`;
  const mouseUrl = `${localePrefix}/mousegame`;
  const keyboardUrl = `${localePrefix}/keyboardgame`;
  const cameraUrl = `${localePrefix}/cameragame`;

  return (
    <div className="text-center">
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center gap-3">
          <h1 className="text-xl font-semibold">{t("title")}</h1>
          <p className="my-4">{t("description")}</p>
          <div className="flex w-full flex-wrap items-center justify-center gap-3 ">
            <Link
              href={mouseUrl}
              className="hover:rounded hover:bg-slate-100 hover:drop-shadow-xl"
            >
              <div id="mouseTile" className="rounded border p-10 md:p-24">
                <Image
                  src={mouseImage}
                  alt={t("mouseImageAlt")}
                  width={150}
                  height={150}
                />
                <p className="mt-5">{t("mouseText")}</p>
              </div>
            </Link>
            <Link
              href={keyboardUrl}
              className="hover:rounded hover:bg-slate-100 hover:drop-shadow-xl"
            >
              <div id="keyboardTile" className="rounded border p-10 md:p-24">
                <Image
                  src={keyboardImage}
                  alt={t("keyboardImageAlt")}
                  width={150}
                  height={150}
                />
                <p className="mt-5">{t("keyboardText")}</p>
              </div>
            </Link>
            <Link
              href={cameraUrl}
              className="hover:rounded hover:bg-slate-100 hover:drop-shadow-xl"
            >
              <div id="cameraTile" className="rounded border p-10 md:p-24">
                <Image
                  src={cameraImage}
                  alt={t("cameraImageAlt")}
                  width={150}
                  height={150}
                />
                <p className="mt-5">{t("cameraText")}</p>
              </div>
            </Link>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-3 md:flex-row ">
            <h2 className="my-4 text-lg font-semibold">{t("rulesTitle")}</h2>
            <p className="my-4 max-w-xl">{t("rules")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
