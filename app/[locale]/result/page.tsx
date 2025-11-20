import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import rockImage from "@/public/icons/rock.png";
import paperImage from "@/public/icons/paper.png";
import scissorsImage from "@/public/icons/scissors.png";
import altImage from "@/public/icons/undefined.png";
import { getLocale, getTranslations } from "next-intl/server";

type Choice = "Rock" | "Paper" | "Scissors";

export default async function Result({
  searchParams,
}: {
  searchParams: { selectedValue?: string };
}) {
  const playerValue = normalizeChoice(searchParams.selectedValue);
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("result"),
  ]);
  const result = createMatchResult(playerValue, t);
  const rootUrl = `/${locale}`;

  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col items-center">
      <div className="flex flex-wrap items-center justify-center gap-8 py-6">
        <ChoiceCard
          title={t("plChoice")}
          choice={result.player}
          visible={Boolean(playerValue)}
        />
        <ChoiceCard
          title={t("compChoice")}
          choice={result.computer}
          visible={Boolean(playerValue)}
        />
      </div>
      {playerValue && (
        <>
          <p className="mb-3 text-xl font-semibold">{t("result")}</p>
          <div className="text-4xl font-semibold">
            {determineWinner(result.player.value, result.computer.value, t)}
          </div>
        </>
      )}
      <div className="mt-6 flex items-center text-center">
        <Link href={rootUrl}>
          <Button>{t("playAgainButton")}</Button>
        </Link>
      </div>
    </div>
  );
}

type PlayerChoiceValue = Choice | "Alt";

type ChoiceView = {
  value: PlayerChoiceValue;
  choice: string;
  imageSrc: StaticImageData;
  imgAltText: string;
};

type Translator = (key: string) => string;

function createMatchResult(playerChoice: Choice | null, t: Translator) {
  const options: Record<Choice, ChoiceView> = {
    Rock: {
      value: "Rock",
      choice: t("rock"),
      imageSrc: rockImage,
      imgAltText: t("altRock"),
    },
    Paper: {
      value: "Paper",
      choice: t("paper"),
      imageSrc: paperImage,
      imgAltText: t("altPaper"),
    },
    Scissors: {
      value: "Scissors",
      choice: t("scissors"),
      imageSrc: scissorsImage,
      imgAltText: t("altScissors"),
    },
  };

  const fallback: ChoiceView = {
    value: "Alt",
    choice: t("rock"),
    imageSrc: altImage,
    imgAltText: "Alt",
  };

  const pcValue = randomChoice();
  return {
    player: playerChoice ? options[playerChoice] : fallback,
    computer: options[pcValue],
  };
}

function determineWinner(
  playerChoice: PlayerChoiceValue,
  pcChoice: PlayerChoiceValue,
  t: Translator,
) {
  if (playerChoice === "Alt" || pcChoice === "Alt") {
    return t("draw");
  }
  if (playerChoice === pcChoice) {
    return t("draw");
  }
  switch (playerChoice) {
    case "Rock":
      return pcChoice === "Scissors" ? t("win") : t("lose");
    case "Paper":
      return pcChoice === "Rock" ? t("win") : t("lose");
    case "Scissors":
      return pcChoice === "Paper" ? t("win") : t("lose");
    default:
      return t("draw");
  }
}

function normalizeChoice(choice?: string): Choice | null {
  if (choice === "Rock" || choice === "Paper" || choice === "Scissors") {
    return choice;
  }
  return null;
}

function randomChoice(): Choice {
  const values: Choice[] = ["Rock", "Paper", "Scissors"];
  return values[Math.floor(Math.random() * values.length)];
}

function ChoiceCard({
  title,
  choice,
  visible,
}: {
  title: string;
  choice: ChoiceView;
  visible: boolean;
}) {
  if (!visible) {
    return null;
  }
  return (
    <div className="flex flex-col items-center text-center">
      <Image src={choice.imageSrc} alt={choice.imgAltText} width={150} height={150} />
      <p className="mt-3 text-xl">
        {title} {choice.choice}
      </p>
    </div>
  );
}
