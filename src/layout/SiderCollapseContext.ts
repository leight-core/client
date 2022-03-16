import {useContext} from "@leight-core/client";
import {createContext} from "react";
import {ISiderCollapseContext} from "@leight-core/api";

export const SiderCollapseContext = createContext<ISiderCollapseContext>(null as unknown as ISiderCollapseContext);

export const useSiderCollapseContext = () => useContext<ISiderCollapseContext>(SiderCollapseContext, "SiderCollapseContext");
