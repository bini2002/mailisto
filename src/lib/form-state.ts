import type { FieldErrors } from "./validation";

export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: FieldErrors;
  name?: string;
}

export const initialFormState: FormState = { status: "idle" };
