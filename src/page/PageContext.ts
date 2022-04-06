import {IPageContext} from "@leight-core/api";
import {useContext} from "@leight-core/client";
import {createContext} from "react";

export const PageContext = createContext<IPageContext>(null as any);

export const usePageContext = () => useContext<IPageContext>(PageContext, "PageContext");
