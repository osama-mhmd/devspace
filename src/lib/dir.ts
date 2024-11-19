import { languageTag } from "@/paraglide/runtime";

export default function dir(
  type?: "css" | "html",
): "rtl" | "ltr" | "left" | "right" {
  if (type == "css") return languageTag() == "ar" ? "right" : "left";
  return languageTag() == "ar" ? "rtl" : "ltr";
}
