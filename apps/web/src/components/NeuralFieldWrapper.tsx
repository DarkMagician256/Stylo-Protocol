"use client";

import dynamic from "next/dynamic";

const NeuralFieldBase = dynamic(
  () => import("./NeuralField").then((mod) => mod.NeuralField),
  { ssr: false }
);

export function NeuralFieldWrapper() {
  return <NeuralFieldBase />;
}
