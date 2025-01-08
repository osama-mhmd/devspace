import { FieldError } from "react-hook-form";
import * as m from "@/paraglide/messages";

export default function Error({ error }: { error: FieldError | undefined }) {
  if (!error) return;
  // @ts-ignore
  return <p className="error">{m[error.message]()}</p>;
}
