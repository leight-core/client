import {useContext} from "@leight-core/client";
import {createContext} from "react";
import {IBlockContext} from "@leight-core/api";

export const FormBlockContext = createContext<IBlockContext>(null as any);

/**
 * Access to UI blocking context of a Form.
 */
export const useFormBlockContext = () => useContext<IBlockContext>(FormBlockContext, "FormBlockContext");
