import { Inter, Merienda, Rubik, Lilita_One } from "next/font/google";

const interFont = Inter({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});
const meriendaFont = Merienda({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});
const rubikFont = Rubik({
  subsets: ["arabic"],
  display: "swap",
  adjustFontFallback: false,
});
const lilitaOne = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
});

export const merienda = meriendaFont.className;
export const inter = interFont.className;
export const rubik = rubikFont.className;
export const lilita = lilitaOne.className;
