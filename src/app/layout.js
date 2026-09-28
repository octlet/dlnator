import "plyr/dist/plyr.css";
import "./globals.css";
import Main from "@layouts/Main";
import Shell from "@layouts/Shell";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "dlnator",
  description:
    "a tool to download media from various sources and serve them locally with a web interface.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Main>
          <Shell>{children}</Shell>
        </Main>
      </body>
    </html>
  );
}
