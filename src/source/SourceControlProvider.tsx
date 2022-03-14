import {FilterProvider, IFilterProviderProps, IOrderByProviderProps, OrderByProvider} from "@leight-core/client";
import {PropsWithChildren} from "react";

export interface ISourceControlProviderProps<TFilter = any, TOrderBy = any> {
	filterProviderProps?: IFilterProviderProps<TFilter>;
	orderByProviderProps?: IOrderByProviderProps<TOrderBy>;
}

export function SourceControlProvider<TFilter = any, TOrderBy = any>({filterProviderProps, orderByProviderProps, children}: PropsWithChildren<ISourceControlProviderProps<TFilter, TOrderBy>>) {
	return <FilterProvider<TFilter> {...filterProviderProps}>
		<OrderByProvider<TOrderBy> {...orderByProviderProps}>
			{children}
		</OrderByProvider>
	</FilterProvider>
}
