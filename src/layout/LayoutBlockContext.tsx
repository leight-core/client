import {useContext} from "@leight-core/client";
import {createContext} from "react";
import {IBlockContext} from "@leight-core/api";

export const LayoutBlockContext = createContext<IBlockContext>(null as unknown as IBlockContext);

export const useLayoutBlockContext = () => useContext<IBlockContext>(LayoutBlockContext, "LayoutBlockContext");
