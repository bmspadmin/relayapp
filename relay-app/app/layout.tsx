import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RELAY — Pass it like a baton",
  description: "Username-based file sharing for people, teams and workspaces."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}