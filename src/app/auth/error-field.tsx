import { FieldError } from "react-hook-form";

export default function Error({ error }: { error: FieldError | undefined }) {
  // TODO: make this better
  if (!error) return;
  // @ts-ignore
  return <p className="error">{m[error.message]()}</p>;
}
