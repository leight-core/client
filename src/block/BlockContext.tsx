import {IBlockContext} from "@leight-core/api";
import {useContext} from "@leight-core/client";
import {createContext} from "react";

export const BlockContext = createContext<IBlockContext>(null as unknown as IBlockContext);

export const useBlockContext = () => useContext<IBlockContext>(BlockContext, "BlockContext");
