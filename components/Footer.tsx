import { getTranslations } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer>
      <span className="font-semibold">
        {t("project")}&nbsp;&copy; Thomas Scheiber 2024
      </span>
    </footer>
  );
}
