import {FilterContext} from "@leight-core/client";
import {PropsWithChildren, useEffect, useState} from "react";

export interface IFilterProviderProps<TFilter = any> {
	name: string;
	/**
	 * Default pre-set filter; could be overridden by a user. Apply filter prop takes precedence.
	 */
	defaultFilter?: TFilter;
	/**
	 * Apply the given filter all the times (regardless of values set by a user)
	 */
	applyFilter?: TFilter;
}

export function FilterProvider<TFilter, >({name, defaultFilter, applyFilter, ...props}: PropsWithChildren<IFilterProviderProps<TFilter>>) {
	const [filter, setFilter] = useState<TFilter | undefined>(applyFilter || defaultFilter);
	useEffect(() => {
		setFilter(defaultFilter);
	}, [defaultFilter]);
	useEffect(() => {
		setFilter(applyFilter);
	}, [applyFilter]);
	return <FilterContext.Provider
		value={{
			name,
			filter,
			setFilter: filter => setFilter({...filter, ...applyFilter}),
		}}
		{...props}
	/>;
}
