import React from "react";
import { DownloadPortal } from "@/components/orders/DownloadPortal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Audio Download Portal | Regent Audios",
  description: "Download certified master WAV, untagged MP3, multi-track stems, and signed PDF license agreement.",
};

export default function DownloadPage({ params }: { params: { token: string } }) {
  return <DownloadPortal token={params.token} />;
}
