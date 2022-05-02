import {FilterContext, rundef} from "@leight-core/client";
import deepmerge from "deepmerge";
import empty from "is-empty";
import {PropsWithChildren, useEffect, useState} from "react";

export type IFilterProviderProps<TFilter = any> = PropsWithChildren<{
	name: string;
	/**
	 * Default pre-set filter; could be overridden by a user. Apply filter prop takes precedence.
	 */
	defaultFilter?: TFilter;
	/**
	 * Apply the given filter all the times (regardless of values set by a user)
	 */
	applyFilter?: TFilter;
}>;

export function FilterProvider<TFilter, >({name, defaultFilter, applyFilter, ...props}: IFilterProviderProps<TFilter>) {
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
			applyFilter: apply => setFilter({...filter, ...apply, ...applyFilter}),
			mergeFilter: apply => setFilter({...deepmerge<TFilter, TFilter>(filter || {}, apply), ...applyFilter}),
			isEmpty: () => empty(rundef(filter)),
		}}
		{...props}
	/>;
}
