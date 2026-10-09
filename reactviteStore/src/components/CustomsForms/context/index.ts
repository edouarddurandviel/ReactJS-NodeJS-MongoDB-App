import { createContext, useContext } from "react";
import type { UserConnected } from "../../../stores/auth/interfaces";

export const CustomsFormContext = createContext<any | null>(null);
export const CustomFormContextGlobal = createContext<UserConnected | null>(null);

export const useFormContext = () => useContext(CustomFormContextGlobal);
