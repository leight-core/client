import {IQuery, IQueryHook} from "@leight-core/api";
import {SourceContext, useOptionalCursorContext, useOptionalFilterContext, useOptionalOrderByContext, useOptionalQueryParamsContext} from "@leight-core/client";
import {merge} from "@leight-core/utils";
import {PropsWithChildren} from "react";
import {useTranslation} from "react-i18next";
import {UseQueryOptions} from "react-query";

export type ISourceProviderProps<TResponse> = PropsWithChildren<{
	name: string;
	/**
	 * Source of the query
	 */
	useQuery: IQueryHook<IQuery<any, any>, TResponse[]>;
	/**
	 * Enables live refetches of the query
	 */
	live?: number | false,
	/**
	 * Query options.
	 */
	options?: UseQueryOptions<any, any, TResponse[]>;
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
				total: 999,
				pageSize: cursorContext?.size || 10,
				defaultPageSize: cursorContext?.size || 10,
				showSizeChanger: false,
				showQuickJumper: false,
				hideOnSinglePage: false,
				showTotal: (total, [from, to]) => t(`${name}.list.total`, {data: {total, from, to}}),
				onChange: (current, size) => cursorContext?.setPage(current - 1, size),
			} : undefined,
			hasData: () => result.isSuccess && result.data.length > 0,
			map: mapper => result.isSuccess ? result.data.map(mapper) : [],
			data: () => result.isSuccess ? result.data : [],
		}}
		{...props}
	/>;
};
