import { Inter, Rubik, Lilita_One } from "next/font/google";

const interFont = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-inter",
});
const rubikFont = Rubik({
  subsets: ["arabic"],
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-rubik",
});
const lilitaOne = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
  variable: "--font-lilita",
});

export const inter = interFont.variable;
export const rubik = rubikFont.variable;
export const lilita = lilitaOne.variable;

// export const inter = "";
// export const rubik = "";
// export const lilita = "";
