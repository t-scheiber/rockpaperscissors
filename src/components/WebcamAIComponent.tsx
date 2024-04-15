"use client";

import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import * as tmImage from "@teachablemachine/image";
import { useLocale, useTranslations } from "next-intl";

const WebcamComponent = () => {
  const t = useTranslations("webaicomp");
  const locale = useLocale();
  const againUrl = "/" + locale + "/cameragame";
  const resultUrl = "/" + locale + "/result";
  const videoConstraints = {
    width: 540,
    height: 360,
    facingMode: "user",
  };
  const [webcamFeed, setwebcamFeed] = useState<boolean>(true); //webcamFeed
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string>("");
  const [predicted, setPredicted] = useState<string>("");
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setwebcamFeed(false);
    if (imageSrc) {
      setUrl(imageSrc);
    }
  }, [webcamRef]);

  if (url) {
    aiPrediction(url).then((data) => {
      setPredicted(data);
    });
  }

  return (
    <>
      {webcamFeed && (
        <>
          <div className="flex-col items-center text-center">
            <Webcam
              audio={false}
              width={540}
              height={360}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </div>
          <div className="m-3 flex-col items-center gap-3 text-center">
            <Button onClick={capture}>{t("captureButton")}</Button>
          </div>
        </>
      )}
      {predicted && (
        <>
          <div className="m-3 flex-col items-center gap-3 text-center">
            <Image src={url} width={540} height={360} alt="Screenshot" />
            <Link href={resultUrl + "?selectedValue=" + predicted}>
              <Button className="mt-3">{t("resultPageButton")}</Button>
            </Link>
          </div>
        </>
      )}
      {predicted && (
        <>
          <div className="flex-col items-center gap-3 text-center">
            {predicted === "Rock" && (
              <p>
                {t("predictionText")} + {t("rock")}
              </p>
            )}
            {predicted === "Paper" && (
              <p>
                {t("predictionText")} + {t("paper")}
              </p>
            )}
            {predicted === "Scissors" && (
              <p>
                {t("predictionText")} {t("scissors")}
              </p>
            )}
            <div className="flex flex-col items-center">
              <Link href={againUrl}>
                <Button className="mt-3">{t("retryButton")}</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default WebcamComponent;

// Preview the Model: https://teachablemachine.withgoogle.com/models/CoWEt_sY5/

//Model Training Data:

// https://www.kaggle.com/datasets/drgfreeman/rockpaperscissors/data
// https://www.kaggle.com/datasets/sanikamal/rock-paper-scissors-dataset
// https://www.kaggle.com/datasets/glushko/rock-paper-scissors-dataset
// and my own images

async function aiPrediction(image: string): Promise<string> {
  const modelPath: string = "/AI/model.json";
  const metadataPath: string = "/AI/metadata.json";
  let model: tmImage.CustomMobileNet | null = await tmImage.load(
    modelPath,
    metadataPath,
  );
  const img: HTMLImageElement = document.createElement("img");
  img.src = image;

  const data: string = await predict(img, model);

  return gethightestValueKey(data);
}

async function predict(
  image: HTMLImageElement,
  model: tmImage.CustomMobileNet | null,
): Promise<string> {
  if (model) {
    let prediction = await model.predict(image);
    let classPrediction = "";
    for (let i = 0; i < prediction.length && i < 3; i++) {
      if (i > 0) classPrediction += ", ";
      classPrediction +=
        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    }
    return classPrediction;
  } else {
    return "";
  }
}
function findHighestValueKey(obj: { [key: string]: number }): string {
  return Object.keys(obj).reduce((a, b) => (obj[a] > obj[b] ? a : b));
}
function gethightestValueKey(prediction: string): string {
  const predictionArray = prediction.split(", ");
  let predictionObject: { [key: string]: number } = {};
  predictionArray.forEach((element) => {
    const [key, value] = element.split(": ");
    predictionObject[key] = parseFloat(value);
  });
  return findHighestValueKey(predictionObject);
}
