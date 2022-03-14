import {FilterContext} from "@leight-core/client";
import {PropsWithChildren, useState} from "react";

export interface IFilterProviderProps<TFilter = any> {
	/**
	 * Default pre-set filter; could be overridden by a user. Apply filter prop takes precedence.
	 */
	defaultFilter?: TFilter;
	/**
	 * Apply the given filter all the times (regardless of values set by a user)
	 */
	applyFilter?: TFilter;
}

export function FilterProvider<TFilter, >({defaultFilter, applyFilter, ...props}: PropsWithChildren<IFilterProviderProps<TFilter>>) {
	const [filter, setFilter] = useState<TFilter | undefined>(applyFilter || defaultFilter);
	return <FilterContext.Provider
		value={{
			filter,
			setFilter: filter => setFilter({...filter, ...applyFilter}),
		}}
		{...props}
	/>;
}
