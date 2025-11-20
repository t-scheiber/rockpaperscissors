"use client";

import dynamic from "next/dynamic";
import CameraLoader from "./CameraLoader";

const WebcamAIComponent = dynamic(
  () => import("./WebcamAIComponent"),
  {
    ssr: false,
    loading: () => <CameraLoader />,
  },
);

export default function CameraGameClient() {
  return <WebcamAIComponent />;
}

