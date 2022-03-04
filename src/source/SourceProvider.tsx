import {merge, SourceContext} from "@leight-core/client";
import {IQuery, IQueryHook, IQueryParams, IQueryResult} from '@leight-core/api';
import {PropsWithChildren, useEffect, useState} from "react";
import {UseQueryOptions} from "react-query";

export interface ISourceProviderProps<TResponse, TOrderBy = any, TFilter = any, TQuery extends IQueryParams = IQueryParams> {
	/**
	 * Source of the query
	 */
	useQuery: IQueryHook<IQuery<TOrderBy, TFilter>, IQueryResult<TResponse>, TQuery>;
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

export const SourceProvider = <TResponse, TOrderBy = any, TFilter = any, TQuery extends IQueryParams = IQueryParams>(
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
	}: PropsWithChildren<ISourceProviderProps<TResponse, TOrderBy, TFilter, TQuery>>
) => {
	const [page, setPage] = useState<number>(defaultPage);
	const [orderBy, setOrderBy] = useState<TOrderBy | null | undefined>(merge<TOrderBy, TOrderBy>(defaultOrderBy || {}, props.orderBy || {}));
	const [filter, setFilter] = useState<TFilter | null | undefined>(merge<TFilter, TFilter>(defaultFilter || {}, props.filter || {}));
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
		props.filter && setFilter(merge<TFilter, TFilter>(defaultFilter || {}, props.filter));
	}, [props.filter]);
	useEffect(() => {
		props.orderBy && setOrderBy(merge<TOrderBy, TOrderBy>(defaultOrderBy || {}, props.orderBy));
	}, [props.orderBy]);
	useEffect(() => {
		props.query && setQuery(merge<TQuery, TQuery>(defaultQuery || {}, props.query));
	}, [props.query]);

	return <SourceContext.Provider
		value={{
			result,
			page,
			setPage: (page, size) => {
				setPage(page);
				setSize(size || defaultSize);
			},
			size,
			setSize,
			orderBy,
			setOrderBy: orderBy => setOrderBy({...orderBy, ...props.orderBy}),
			mergeOrderBy: input => setOrderBy({...orderBy, ...input, ...props.orderBy}),
			filter,
			setFilter: filter => setFilter({...filter, ...props.filter}),
			mergeFilter: input => setFilter({...filter, ...input, ...props.filter}),
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
					onChange: (current, size) => this.setPage(current - 1, size),
				} : undefined;
			},
			hasData: () => result.isSuccess && result.data.count > 0,
			map: mapper => result.isSuccess ? result.data.items.map(mapper) : [],
			data: () => result.isSuccess ? result.data : {items: [], size: 0, count: 0, total: 0, pages: 0},
		}}
		{...props}
	/>;
};
