"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { predictHandFromImage } from "@/lib/teachableModel";

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
  const [webcamFeed, setwebcamFeed] = useState(true); //webcamFeed
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState("");
  const [predicted, setPredicted] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setwebcamFeed(false);
    if (!imageSrc) {
      return;
    }
    setIsPredicting(true);
    setPredictionError(null);
    setPredicted("");
    setUrl(imageSrc);
  }, [webcamRef]);

  useEffect(() => {
    if (!url) {
      return;
    }

    let cancelled = false;
    predictHandFromImage(url)
      .then((result) => {
        if (!cancelled) {
          setPredicted(result);
        }
      })
      .catch((error) => {
        console.error("Failed to run prediction", error);
        if (!cancelled) {
          setPredictionError(t("errorMessageFallback"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsPredicting(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [t, url]);

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
      {predictionError && (
        <div className="mt-4 text-center text-sm text-red-500">
          {predictionError}
        </div>
      )}
      {predicted && !predictionError && (
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
      {isPredicting && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {t("predictionLoading")}
        </div>
      )}
    </>
  );
};

export default WebcamComponent;
