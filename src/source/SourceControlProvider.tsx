import {FilterProvider, IFilterProviderProps, IOrderByProviderProps, OrderByProvider} from "@leight-core/client";
import {PropsWithChildren} from "react";

export interface ISourceControlProviderProps<TFilter = any, TOrderBy = any> {
	filterProviderProps?: IFilterProviderProps<TFilter>;
	orderByProviderProps?: IOrderByProviderProps<TOrderBy>;

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
}

export function SourceControlProvider<TFilter = any, TOrderBy = any>(
	{
		filterProviderProps,
		orderByProviderProps,
		defaultFilter,
		applyFilter,
		defaultOrderBy,
		children,
	}: PropsWithChildren<ISourceControlProviderProps<TFilter, TOrderBy>>) {
	return <FilterProvider<TFilter>
		defaultFilter={defaultFilter}
		applyFilter={applyFilter}
		{...filterProviderProps}
	>
		<OrderByProvider<TOrderBy>
			defaultOrderBy={defaultOrderBy}
			{...orderByProviderProps}
		>
			{children}
		</OrderByProvider>
	</FilterProvider>
}
