import { useRef } from "react";
import { type CreateFormStore, createFormStore } from "../store";

// User types → store updates → selector computes → UI updates

export const useForm = () => {
  const storeRef = useRef<CreateFormStore>(null);

  if (!storeRef.current) {
    storeRef.current = createFormStore();
  }

  const submit = () => {
    const isValid = storeRef.current?.validate();
    if (isValid) {
      console.log("SUBMIT", storeRef.current?.getValues());
    }
  };

  return {
    store: storeRef.current,
    submit,
  };
};
