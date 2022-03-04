import {useContext, useOptionalContext} from "@leight-core/client";
import {createContext} from "react";
import {IItemGroupContext} from "@leight-core/api";

export const ItemGroupContext = createContext<IItemGroupContext>(null as any);

export const useItemGroupContext = () => useContext<IItemGroupContext>(ItemGroupContext, "ItemGroupContext");

export const useOptionalItemGroupContext = () => useOptionalContext<IItemGroupContext>(ItemGroupContext as any);
