import type { Metadata } from "next";
import { business } from "@/lib/data";
import { TrackBoard } from "./TrackBoard";

export const metadata: Metadata = { title: "Track files | India Business One" };

export default function TrackPage() {
  return (
    <div className="wrap">
      <header className="page-head">
        <h1>Where your files are</h1>
        <p>
          Every application for {business.name}, the desk it is at, and how long it has been there. Each status says where it
          came from.
        </p>
      </header>
      <TrackBoard />
    </div>
  );
}
