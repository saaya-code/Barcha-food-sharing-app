import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barcha! - Food Surplus Exchange Platform",
  description: "A crowdsourced platform for sharing surplus food in Tunisia. Reduce waste, help your community.",
};

// Root layout for non-locale routes only (API routes, auth callbacks, etc.)
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
