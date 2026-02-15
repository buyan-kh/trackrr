import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrackMRR — Business Metrics Dashboard",
  description:
    "Track MRR, ARR, and Polymarket portfolio value in one clean dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="glass-bg" aria-hidden="true">
          <div className="ambient-blob" />
        </div>
        {children}
      </body>
    </html>
  );
}
