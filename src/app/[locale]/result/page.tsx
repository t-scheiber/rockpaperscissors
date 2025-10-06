import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import rockImage from "../../../../public/icons/rock.png";
import paperImage from "../../../../public/icons/paper.png";
import scissorsImage from "../../../../public/icons/scissors.png";
import altImage from "../../../../public/icons/undefined.png";
import { useLocale, useTranslations } from "next-intl";

function Result({ searchParams }: { searchParams: { selectedValue: string } }) {
  const playerValue = searchParams.selectedValue;

  const t = useTranslations("result");

  let player = {
    value: "Alt Image",
    choice: "Alt Image",
    imageSrc: altImage,
    imgAltText: "Alt Image",
  };

  if (playerValue === "Rock") {
    player = {
      value: "Rock",
      choice: `${t("rock")}`,
      imageSrc: rockImage,
      imgAltText: `${t("altRock")}`,
    };
  }
  if (playerValue === "Paper") {
    player = {
      value: "Paper",
      choice: `${t("paper")}`,
      imageSrc: paperImage,
      imgAltText: `${t("altPaper")}`,
    };
  }
  if (playerValue === "Scissors") {
    player = {
      value: "Scissors",
      choice: `${t("scissors")}`,
      imageSrc: scissorsImage,
      imgAltText: `${t("altScissors")}`,
    };
  }
  const pcValue = Math.floor(Math.random() * 3) + 1;

  let pc = {
    value: "Alt Image",
    choice: "Alt Image",
    imageSrc: altImage,
    imgAltText: "Alt Image",
  };

  if (pcValue === 1) {
    pc = {
      value: "Rock",
      choice: `${t("rock")}`,
      imageSrc: rockImage,
      imgAltText: `${t("altRock")}`,
    };
  }
  if (pcValue === 2) {
    pc = {
      value: "Paper",
      choice: `${t("paper")}`,
      imageSrc: paperImage,
      imgAltText: `${t("altPaper")}`,
    };
  }
  if (pcValue === 3) {
    pc = {
      value: "Scissors",
      choice: `${t("scissors")}`,
      imageSrc: scissorsImage,
      imgAltText: `${t("altScissors")}`,
    };
  }

  const winner = DetermineWinner(player.value, pc.value);

  const locale = useLocale();
  const rootUrl = "/" + locale + "/";

  return (
    <div className="mx-auto flex h-full w-[60vw] flex-col items-center">
      <div className="flex h-[50vh] flex-row items-center">
        <div
          className="m-4 flex flex-col items-center text-center"
          id="playerChoice"
        >
          {playerValue && (
            <Image
              src={player.imageSrc}
              alt={player.imgAltText}
              width={100}
              height={100}
            />
          )}
          {playerValue && (
            <p className="mt-3 text-xl">
              {t("plChoice")} {player.choice}
              <br />
            </p>
          )}
        </div>
        <div
          id="pcChoice"
          className="m-4 flex flex-col items-center text-center"
        >
          {playerValue && (
            <Image
              src={pc.imageSrc}
              alt={pc.imgAltText}
              width={100}
              height={100}
            />
          )}
          {playerValue && (
            <p className="mt-3 text-xl">
              {t("compChoice")} {pc.choice}
            </p>
          )}
        </div>
      </div>
      {playerValue && (
        <>
          <p className="mb-3 text-xl font-semibold">{t("result")}</p>
          <div className="text-4xl font-semibold">{winner}</div>
        </>
      )}
      <div className="mt-3 flex items-center text-center">
        <Link href={rootUrl}>
          <Button>{t("playAgainButton")}</Button>
        </Link>
      </div>
    </div>
  );
}

export default Result;

function DetermineWinner(playerChoice: string, pcChoice: string) {
  const t = useTranslations("result");
  if (playerChoice === pcChoice) {
    return `${t("draw")}`;
  }
  switch (playerChoice) {
    case "Rock":
      return pcChoice === "Scissors" ? `${t("win")}` : `${t("lose")}`;
    case "Paper":
      return pcChoice === "Rock" ? `${t("win")}` : `${t("lose")}`;
    case "Scissors":
      return pcChoice === "Paper" ? `${t("win")}` : `${t("lose")}`;
    default:
      return "Invalid input";
  }
}
