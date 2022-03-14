import {CursorProvider, FilterProvider, ICursorProviderProps, IFilterProviderProps, IOrderByProviderProps, IQueryParamsProviderProps, OrderByProvider, QueryParamsProvider} from "@leight-core/client";
import {PropsWithChildren} from "react";
import {IQueryParams} from "@leight-core/api";

export interface ISourceControlProviderProps<TFilter = any, TOrderBy = any, TQueryParams extends IQueryParams | void = void> {
	filterProviderProps?: IFilterProviderProps<TFilter>;
	orderByProviderProps?: IOrderByProviderProps<TOrderBy>;
	queryParamsProviderProps?: IQueryParamsProviderProps<TQueryParams>;
	cursorProviderProps?: ICursorProviderProps;

	/**
	 * Default pre-set filter; could be overridden by a user. Apply filter prop takes precedence.
	 */
	defaultFilter?: TFilter;
	/**
	 * Apply the given filter all the times (regardless of values set by a user)
	 */
	applyFilter?: TFilter;
	/**
	 * Default pre-set order; could be overridden by a user. Apply filter prop takes precedence.
	 */
	defaultOrderBy?: TOrderBy;
	defaultPage?: number;
	defaultSize?: number;
	defaultQueryParams?: TQueryParams;
}

export function SourceControlProvider<TFilter = any, TOrderBy = any, TQueryParams extends IQueryParams | void = void>(
	{
		filterProviderProps,
		orderByProviderProps,
		queryParamsProviderProps,
		cursorProviderProps,
		defaultFilter,
		applyFilter,
		defaultOrderBy,
		defaultPage,
		defaultSize,
		defaultQueryParams,
		children,
	}: PropsWithChildren<ISourceControlProviderProps<TFilter, TOrderBy, TQueryParams>>) {
	return <QueryParamsProvider
		defaultQueryParams={defaultQueryParams}
		{...queryParamsProviderProps}
	>
		<FilterProvider<TFilter>
			defaultFilter={defaultFilter}
			applyFilter={applyFilter}
			{...filterProviderProps}
		>
			<OrderByProvider<TOrderBy>
				defaultOrderBy={defaultOrderBy}
				{...orderByProviderProps}
			>
				<CursorProvider
					defaultPage={defaultPage}
					defaultSize={defaultSize}
					{...cursorProviderProps}
				>
					{children}
				</CursorProvider>
			</OrderByProvider>
		</FilterProvider>
	</QueryParamsProvider>;
}
