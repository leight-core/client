import {IQuery, IQueryHook} from "@leight-core/api";
import {SourceContext, useOptionalCursorContext, useOptionalFilterContext, useOptionalOrderByContext, useOptionalQueryParamsContext} from "@leight-core/client";
import {merge} from "@leight-core/utils";
import {PropsWithChildren} from "react";
import {useQuery as useCoolQuery, UseQueryOptions} from "react-query";

export type ISourceProviderProps<TResponse> = PropsWithChildren<{
	name: string;
	/**
	 * Source of the query
	 */
	useQuery: IQueryHook<IQuery, TResponse[]>;
	/**
	 * Query used to count backend items by the given query (for pagination).
	 */
	useCountQuery?: IQueryHook<IQuery, number>;
	/**
	 * Enables live refetches of the query
	 */
	live?: number | false,
	/**
	 * Query options.
	 */
	options?: UseQueryOptions<any, any, TResponse[]>;
	withCount?: boolean;
}>;

export const SourceProvider = <TResponse, >(
	{
		name,
		useQuery,
		useCountQuery,
		withCount = false,
		live = false,
		options,
		...props
	}: ISourceProviderProps<TResponse>
) => {
	const filterContext = useOptionalFilterContext<any>();
	const orderByContext = useOptionalOrderByContext<any>();
	const cursorContext = useOptionalCursorContext();
	const queryParamsContext = useOptionalQueryParamsContext<any>();

	if (!withCount) {
		useCountQuery = undefined;
	}
	if (!useCountQuery) {
		useCountQuery = () => useCoolQuery<number>({
			queryFn: () => 0,
		});
	}

	const query = useQuery({
		size: cursorContext?.size,
		page: cursorContext?.page,
		filter: filterContext?.filter,
		orderBy: orderByContext?.orderBy,
	}, queryParamsContext?.queryParams, merge({
		keepPreviousData: true,
		refetchInterval: live,
	}, options || {}));
	const count = useCountQuery({
		filter: filterContext?.filter,
	}, queryParamsContext?.queryParams, {
		keepPreviousData: true,
		refetchInterval: live,
	});

	const hasData = () => Array.isArray(query?.data) && query.data.length > 0;

	return <SourceContext.Provider
		value={{
			name,
			result: query,
			count: withCount ? count : undefined,
			hasData,
			map: mapper => hasData() ? (query.data?.map(mapper) || []) : [],
			data: () => hasData() ? (query.data || []) : [],
			hasMore: () => {
				if (!withCount) {
					console.warn(`Querying ${name}.hasMore() without counting enabled!`);
					return false;
				}
				if (!count.isSuccess) {
					return false;
				}
				if (!cursorContext) {
					console.warn(`Querying ${name}.hasMore() without cursor context (cannot do paging without it)!`);
					return false;
				}
				const pages = Math.ceil(count.data / cursorContext.size);
				console.log("Number of pages ", pages);
				return cursorContext.page < pages;
			},
			more: () => {
				console.log(`Querying ${name}.more()`, cursorContext);
			},
		}}
		{...props}
	/>;
};
