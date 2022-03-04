import {useContext} from "@leight-core/client";
import {createContext} from "react";
import {IQueryParams, ISourceContext} from "@leight-core/api";

export const SourceContext = createContext<ISourceContext<any, any, any, any>>(null as any);

export const useSourceContext = <TResponse, TQuery extends IQueryParams = IQueryParams, TOrderBy = void, TFilter = void>() => useContext<ISourceContext<TResponse, TQuery, TOrderBy, TFilter>>(SourceContext, "SourceContext");
