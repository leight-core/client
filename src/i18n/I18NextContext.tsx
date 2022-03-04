import {useContext} from "@leight-core/client";
import {createContext} from "react";
import {II18NextContext} from "@leight-core/api";

export const I18NextContext = createContext<II18NextContext>(null as unknown as II18NextContext);

export const useI18NextContext = () => useContext<II18NextContext>(I18NextContext, "I18NextContext");
