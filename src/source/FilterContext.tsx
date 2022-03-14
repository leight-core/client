import {useContext, useOptionalContext} from "@leight-core/client";
import {createContext} from "react";
import {IFilterContext} from "@leight-core/api";

export const FilterContext = createContext<IFilterContext>(null as any);

export const useFilterContext = <TFilter, >() => useContext<IFilterContext<TFilter>>(FilterContext, "FilterContext");

export const useOptionalFilterContext = <TFilter, >() => useOptionalContext<IFilterContext<TFilter>>(FilterContext as any);
