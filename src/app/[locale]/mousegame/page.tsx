import Image from "next/image";
import rockImage from "/public/rock.png";
import paperImage from "/public/paper.png";
import scissorsImage from "/public/scissors.png";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

function MousegamePage() {
  const t = useTranslations("mousegame");
  const locale = useLocale();
  const resultUrl = "/" + locale + "/result";
  return (
    <div>
      <p className="flex items-center justify-center p-3">{t("description")}</p>
      <div className="flex items-center justify-center gap-3">
        <Link
          href={{
            pathname: `${resultUrl}`,
            query: {
              selectedValue: "Rock",
            },
          }}
          className="hover:rounded hover:bg-slate-100 hover:drop-shadow-xl"
        >
          <div className="rounded border p-6">
            <Image
              src={rockImage}
              alt={t("altRock")}
              width="450"
              height="450"
            />
            <p className="flex items-center justify-center">{t("rock")}</p>
          </div>
        </Link>
        <Link
          href={{
            pathname: `${resultUrl}`,
            query: {
              selectedValue: "Paper",
            },
          }}
          className="hover:rounded hover:bg-slate-100 hover:drop-shadow-xl"
        >
          <div className="rounded border p-6">
            <Image
              src={paperImage}
              alt={t("altPaper")}
              width="450"
              height="450"
            />
            <p className="flex items-center justify-center">{t("paper")}</p>
          </div>
        </Link>
        <Link
          href={{
            pathname: `${resultUrl}`,
            query: {
              selectedValue: "Scissors",
            },
          }}
          className="hover:rounded hover:bg-slate-100 hover:drop-shadow-xl"
        >
          <div className="rounded border p-6">
            <Image
              src={scissorsImage}
              alt={t("altScissors")}
              width="450"
              height="450"
            />
            <p className="flex items-center justify-center">{t("scissors")}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default MousegamePage;
