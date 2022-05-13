import {IQuery, IQueryHook, IQueryResult} from "@leight-core/api";
import {merge, SourceContext, useOptionalCursorContext, useOptionalFilterContext, useOptionalOrderByContext, useOptionalQueryParamsContext} from "@leight-core/client";
import {PropsWithChildren} from "react";
import {useTranslation} from "react-i18next";
import {UseQueryOptions} from "react-query";

export type ISourceProviderProps<TResponse> = PropsWithChildren<{
	name: string;
	/**
	 * Source of the query
	 */
	useQuery: IQueryHook<IQuery<any, any>, IQueryResult<TResponse>>;
	/**
	 * Enables live refetches of the query
	 */
	live?: number | false,
	/**
	 * Query options.
	 */
	options?: UseQueryOptions<any, any, IQueryResult<TResponse>>;
}>;

export const SourceProvider = <TResponse, >(
	{
		name,
		useQuery,
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

	const result = useQuery({
		size: cursorContext?.size,
		page: cursorContext?.page,
		filter: filterContext?.filter,
		orderBy: orderByContext?.orderBy,
	}, queryParamsContext?.queryParams, merge({
		keepPreviousData: true,
		refetchInterval: live,
	}, options || {}));

	return <SourceContext.Provider
		value={{
			name,
			result,
			pagination: () => result.isSuccess ? {
				responsive: true,
				current: (cursorContext?.page || 0) + 1,
				total: result.data.total,
				pageSize: cursorContext?.size || 10,
				defaultPageSize: cursorContext?.size || 10,
				showSizeChanger: false,
				showQuickJumper: false,
				hideOnSinglePage: false,
				showTotal: (total, [from, to]) => t(`${name}.list.total`, {data: {total, from, to}}),
				onChange: (current, size) => cursorContext?.setPage(current - 1, size),
			} : undefined,
			hasData: () => result.isSuccess && result.data.count > 0,
			map: mapper => result.isSuccess ? result.data.items.map(mapper) : [],
			data: () => result.isSuccess ? result.data : {items: [], size: 0, count: 0, total: 0, pages: 0},
		}}
		{...props}
	/>;
};
