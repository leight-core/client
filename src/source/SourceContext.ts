import {useContext} from "@leight-core/client";
import {createContext} from "react";
import {IFilter, IOrderBy, IQueryParams, ISourceContext} from "@leight-core/api";

export const SourceContext = createContext<ISourceContext<any, any, any, any>>(null as any);

export const useSourceContext = <TResponse, TFilter extends IFilter | void = void, TOrderBy extends IOrderBy | void = void, TQuery extends IQueryParams | void = void>() => useContext<ISourceContext<TResponse, TFilter, TOrderBy, TQuery>>(SourceContext, "SourceContext");
