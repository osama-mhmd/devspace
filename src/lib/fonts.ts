import { Inter, Merienda, Rubik } from "next/font/google";

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

export const merienda = meriendaFont.className;
export const inter = interFont.className;
export const rubik = rubikFont.className;
