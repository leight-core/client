import {FilterContext} from "@leight-core/client";
import {PropsWithChildren, useState} from "react";

export interface IFilterProviderProps<TFilter = any> {
	defaultFilter?: TFilter;
}

export function FilterProvider<TFilter, >({defaultFilter, ...props}: PropsWithChildren<IFilterProviderProps<TFilter>>) {
	const [filter, setFilter] = useState<TFilter | undefined>(defaultFilter);
	return <FilterContext.Provider
		value={{
			filter,
			setFilter: filter => setFilter({...filter, ...defaultFilter}),
		}}
		{...props}
	/>;
}
