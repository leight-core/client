import {useContext, useOptionalContext} from "@leight-core/client";
import {createContext} from "react";
import {IFormItemContext} from "@leight-core/api";

export const FormItemContext = createContext<IFormItemContext>(null as any);

export const useFormItemContext = () => useContext<IFormItemContext>(FormItemContext, "FormItemContext");

export const useOptionalFormItemContext = () => useOptionalContext<IFormItemContext>(FormItemContext as any);
