import { languageTag } from "@/paraglide/runtime";

export type Direction = "ltr" | "rtl";
export type CSSDirection = "left" | "right";

export default function dir(type?: "css" | "html"): Direction | CSSDirection {
  if (type == "css") return languageTag() == "ar" ? "right" : "left";
  return languageTag() == "ar" ? "rtl" : "ltr";
}
