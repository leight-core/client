import {IDrawerContext} from "@leight-core/api";
import {useContext, useOptionalContext} from "@leight-core/client";
import {createContext} from "react";

export const DrawerContext = createContext<IDrawerContext>(null as any);

export const useDrawerContext = () => useContext<IDrawerContext>(DrawerContext, "DrawerContext");

export const useOptionalDrawerContext = () => useOptionalContext<IDrawerContext>(DrawerContext as any);
