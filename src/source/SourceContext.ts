import {useContext} from "@leight-core/client";
import {createContext} from "react";
import {ISourceContext} from "@leight-core/api";

export const SourceContext = createContext<ISourceContext<any>>(null as any);

export const useSourceContext = <TResponse>() => useContext<ISourceContext<TResponse>>(SourceContext, "SourceContext");
