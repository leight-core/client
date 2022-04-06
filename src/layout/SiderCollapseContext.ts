import {ISiderCollapseContext} from "@leight-core/api";
import {useContext} from "@leight-core/client";
import {createContext} from "react";

export const SiderCollapseContext = createContext<ISiderCollapseContext>(null as unknown as ISiderCollapseContext);

export const useSiderCollapseContext = () => useContext<ISiderCollapseContext>(SiderCollapseContext, "SiderCollapseContext");
