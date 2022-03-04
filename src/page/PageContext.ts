import {useContext} from "@leight-core/client";
import {createContext} from "react";
import {IPageContext} from "@leight-core/api";

export const PageContext = createContext<IPageContext>(null as any);

export const usePageContext = () => useContext<IPageContext>(PageContext, "PageContext");
