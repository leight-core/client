import {useContext, useOptionalContext} from "@leight-core/client";
import {createContext} from "react";
import {IQueryParams, IQueryParamsContext} from "@leight-core/api";

export const QueryParamsContext = createContext<IQueryParamsContext<any>>(null as any);

export const useQueryParamsContext = <TQueryParams extends IQueryParams | void = void, >() => useContext<IQueryParamsContext<TQueryParams>>(QueryParamsContext, "QueryParamsContext");

export const useOptionalQueryParamsContext = <TQueryParams extends IQueryParams | void = void, >() => useOptionalContext<IQueryParamsContext<TQueryParams>>(QueryParamsContext as any);
