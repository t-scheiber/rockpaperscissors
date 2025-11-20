import { getTranslations } from "next-intl/server";
import CameraGameClient from "@/components/CameraGameClient";

export default async function Game() {
  const t = await getTranslations("cameragame");

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-lg">{t("descriptionA")}</p>
        <p className="text-lg">{t("descriptionB")}</p>
        <p className="text-lg">{t("descriptionC")}</p>
        <div className="w-full max-w-xl">
          <CameraGameClient />
        </div>
      </div>
    </div>
  );
}
