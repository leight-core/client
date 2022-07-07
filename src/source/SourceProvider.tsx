import {IQuery, IQueryHook} from "@leight-core/api";
import {SourceContext, useOptionalCursorContext, useOptionalFilterContext, useOptionalOrderByContext, useOptionalQueryParamsContext} from "@leight-core/client";
import {merge} from "@leight-core/utils";
import {PropsWithChildren} from "react";
import {useTranslation} from "react-i18next";
import {useQuery as useCoolQuery, UseQueryOptions} from "react-query";

export type ISourceProviderProps<TResponse> = PropsWithChildren<{
	name: string;
	/**
	 * Source of the query
	 */
	useQuery: IQueryHook<IQuery<any, any>, TResponse[]>;
	/**
	 * Query used to count backend items by the given query (for pagination).
	 */
	useCountQuery?: IQueryHook<IQuery<any, any>, number>;
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
	const {t} = useTranslation();
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
			pagination: () => withCount && count.isSuccess ? {
				responsive: true,
				current: (cursorContext?.page || 0) + 1,
				total: count.data,
				pageSize: cursorContext?.size || 10,
				defaultPageSize: cursorContext?.size || 10,
				showSizeChanger: false,
				showQuickJumper: false,
				hideOnSinglePage: true,
				showTotal: (total, [from, to]) => t(`${name}.list.total`, {data: {total, from, to}}),
				onChange: (current, size) => cursorContext?.setPage(current - 1, size),
			} : undefined,
			hasData,
			map: mapper => hasData() ? (query.data?.map(mapper) || []) : [],
			data: () => hasData() ? (query.data || []) : [],
		}}
		{...props}
	/>;
};
