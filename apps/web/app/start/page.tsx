import type { Metadata } from "next";
import { StartFlow } from "./StartFlow";

export const metadata: Metadata = { title: "Start | India Business One" };

export default function StartPage() {
  return (
    <div className="wrap">
      <StartFlow />
    </div>
  );
}
