import { FieldError } from "react-hook-form";
import * as m from "@/paraglide/messages";

export default function Error({ error }: { error: FieldError | undefined }) {
  if (!error) return;
  // @ts-expect-error error message is not predictable FIX
  return <p className="error">{m[error.message]()}</p>;
}
