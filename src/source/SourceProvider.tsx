import {merge, SourceContext} from "@leight-core/client";
import {IFilter, IOrderBy, IQuery, IQueryHook, IQueryParams, IQueryResult} from '@leight-core/api';
import {PropsWithChildren, useEffect, useState} from "react";
import {UseQueryOptions} from "react-query";

export interface ISourceProviderProps<TResponse, TFilter extends IFilter | void = void, TOrderBy extends IOrderBy | void = void, TQuery extends IQueryParams | void = void> {
	/**
	 * Source of the query
	 */
	useQuery: IQueryHook<IQuery<TFilter, TOrderBy>, IQueryResult<TResponse>, TFilter, TOrderBy, TQuery>;
	/**
	 * Enables live refetches of the query
	 */
	live?: number | false,
	/**
	 * Default (initial) page; if out of range, an error occurs
	 */
	defaultPage?: number;
	/**
	 * Default page size.
	 */
	defaultSize?: number;
	/**
	 * Default order by when source is loaded.
	 */
	defaultOrderBy?: TOrderBy | null;
	/**
	 * Default filter when source is loaded; it could be overridden later on.
	 */
	defaultFilter?: TFilter | null;
	/**
	 * Default query params when source is loaded.
	 */
	defaultQuery?: TQuery;
	/**
	 * Query options.
	 */
	options?: UseQueryOptions<any, any, IQueryResult<TResponse>>;
	/**
	 * Hard filter - all changes are merged against this one.
	 */
	filter?: TFilter
	/**
	 * Hard order by - all changes are merged with this one.
	 */
	orderBy?: TOrderBy
	/**
	 * Hard query - all changes are merge with this one.
	 */
	query?: TQuery
}

export const SourceProvider = <TResponse, TFilter extends IFilter | void = void, TOrderBy extends IOrderBy | void = void, TQuery extends IQueryParams | void = void>(
	{
		useQuery,
		live = false,
		defaultPage = 0,
		defaultSize = 10,
		defaultOrderBy,
		defaultFilter,
		defaultQuery,
		options,
		...props
	}: PropsWithChildren<ISourceProviderProps<TResponse, TFilter, TOrderBy, TQuery>>
) => {
	const [page, setPage] = useState<number>(defaultPage);
	const [orderBy, setOrderBy] = useState<TOrderBy | undefined>(merge<TOrderBy, TOrderBy>(defaultOrderBy || {}, props.orderBy || {}));
	const [filter, setFilter] = useState<TFilter | undefined>(merge<TFilter, TFilter>(defaultFilter || {}, props.filter || {}));
	const [query, setQuery] = useState<TQuery | undefined>(merge<TQuery, TQuery>(defaultQuery || {}, props.query || {}));
	const [size, setSize] = useState<number>(defaultSize);

	const result = useQuery({
		size,
		page,
		filter,
		orderBy,
	}, query, merge({
		keepPreviousData: true,
		refetchInterval: live,
	}, options || {}));

	useEffect(() => {
		props.query && setQuery(merge<TQuery, TQuery>(defaultQuery || {}, props.query));
	}, [props.query]);

	const _setPage = (page: number, size?: number) => {
		setPage(page);
		setSize(size || defaultSize);
	};

	return <SourceContext.Provider
		value={{
			result,
			page,
			setPage: _setPage,
			size,
			setSize,
			orderBy,
			setOrderBy: orderBy => setOrderBy({...orderBy, ...props.orderBy}),
			filter,
			setFilter: filter => setFilter({...filter, ...props.filter}),
			query,
			setQuery: query => setQuery({...query, ...props.query}),
			mergeQuery: input => setQuery({...query, ...input, ...props.query}),
			pagination: function () {
				return result.isSuccess ? {
					size: "small",
					responsive: true,
					current: page + 1,
					total: result.data.total,
					pageSize: result.data.size,
					defaultPageSize: result.data.size,
					showQuickJumper: false,
					hideOnSinglePage: false,
					onChange: (current, size) => _setPage(current - 1, size),
				} : undefined;
			},
			hasData: () => result.isSuccess && result.data.count > 0,
			map: mapper => result.isSuccess ? result.data.items.map(mapper) : [],
			data: () => result.isSuccess ? result.data : {items: [], size: 0, count: 0, total: 0, pages: 0},
		}}
		{...props}
	/>;
};
