import Image from "next/image";
import rockImage from "@/public/rock.png";
import paperImage from "@/public/paper.png";
import scissorsImage from "@/public/scissors.png";
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

export default async function MousegamePage() {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("mousegame"),
  ]);
  const resultUrl = `/${locale}/result`;

  const options = [
    {
      value: "Rock",
      label: t("rock"),
      image: rockImage,
      alt: t("altRock"),
    },
    {
      value: "Paper",
      label: t("paper"),
      image: paperImage,
      alt: t("altPaper"),
    },
    {
      value: "Scissors",
      label: t("scissors"),
      image: scissorsImage,
      alt: t("altScissors"),
    },
  ] as const;

  return (
    <div>
      <p className="flex items-center justify-center p-3 text-center">
        {t("description")}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {options.map((option) => (
          <Link
            key={option.value}
            href={{
              pathname: resultUrl,
              query: {
                selectedValue: option.value,
              },
            }}
            prefetch={false}
            className="hover:rounded hover:bg-slate-100 hover:drop-shadow-xl"
          >
            <div className="rounded border p-6">
              <Image
                src={option.image}
                alt={option.alt}
                width={450}
                height={450}
              />
              <p className="flex items-center justify-center">{option.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
