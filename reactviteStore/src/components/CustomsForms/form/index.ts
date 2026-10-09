import type { ReactNode } from "react";
import { CustomFormContextGlobal } from "../context/"

export const Form = ({ form, children }: {form: any, children: ReactNode}) => {

    // form.store
  return (
    <CustomFormContextGlobal value={null}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.submit();
        }}
      >
    {children}
      </form>
    </CustomFormContextGlobal>
  );
};
