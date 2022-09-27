import {IQuery, IQueryHook, ISourceContext} from "@leight-core/api";
import {SourceContext, useOptionalCursorContext, useOptionalFilterContext, useOptionalOrderByContext, useOptionalQueryParamsContext} from "@leight-core/client";
import {isCallable, merge, uniqueOf} from "@leight-core/utils";
import {useQuery as useCoolQuery, UseQueryOptions} from "@tanstack/react-query";
import {ReactNode, useState} from "react";

export interface ISourceProviderProps<TResponse> {
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

	onSuccess?(response: TResponse[]): void;

	withCount?: boolean;
	children?: ReactNode | ((sourceContext: ISourceContext<TResponse>) => ReactNode);
}

export const SourceProvider = <TResponse, >(
	{
		name,
		useQuery,
		useCountQuery,
		withCount = false,
		live = false,
		options,
		onSuccess,
		children,
	}: ISourceProviderProps<TResponse>
) => {
	const filterContext = useOptionalFilterContext<any>();
	const orderByContext = useOptionalOrderByContext<any>();
	const cursorContext = useOptionalCursorContext();
	const queryParamsContext = useOptionalQueryParamsContext<any>();
	const [data, setData] = useState<TResponse[]>([]);

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
		onSuccess: (response: TResponse[]) => {
			onSuccess?.(response);
			if (cursorContext?.append) {
				setData(prev => uniqueOf<TResponse>(prev.concat(response)));
				return;
			}
			if (cursorContext?.prepend) {
				setData(prev => {
					prev.unshift(...response);
					return uniqueOf(prev);
				});
				return;
			}
			setData(uniqueOf(response));
		},
	}, options || {}));
	const count = useCountQuery({
		filter: filterContext?.filter,
	}, queryParamsContext?.queryParams, {
		keepPreviousData: true,
		refetchInterval: live,
		onSuccess: count => cursorContext?.setPages(count),
	});

	const hasData = () => Array.isArray(data) && data.length > 0;

	return <SourceContext.Provider
		value={{
			name,
			result: query,
			count: withCount ? count : undefined,
			hasData,
			map: mapper => hasData() ? (data?.map(mapper) || []) : [],
			data: () => hasData() ? (data || []) : [],
			reset: () => {
				setData([]);
				cursorContext?.setPage(0);
			},
			hasMore: () => {
				if (query.isFetching) {
					return false;
				}
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
				return cursorContext.page < pages;
			},
			more: async append => {
				if (!cursorContext) {
					console.warn(`Requesting ${name}.more() without cursor context!`);
					return;
				}
				cursorContext?.next(append);
			},
		}}
	>
		{isCallable(children) ? <SourceContext.Consumer>{children as any}</SourceContext.Consumer> : children as ReactNode}
	</SourceContext.Provider>;
};
