import {useContext} from "@leight-core/client";
import {createContext} from "react";
import {IDayJsContext} from "@leight-core/api";

export const DayjsContext = createContext<IDayJsContext>(null as unknown as IDayJsContext);

export const useDayjsContext = () => useContext<IDayJsContext>(DayjsContext, "DayjsContext");
