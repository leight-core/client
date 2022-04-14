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
	const [toggleFilterStatus, setToggleFilterStatus] = useState<{ [index in string]: boolean }>({});
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
			toggleFilterStatus,
			setFilter: filter => setFilter({...filter, ...applyFilter}),
			applyFilter: apply => setFilter({...filter, ...apply, ...applyFilter}),
			toggleFilter: (filter, name, toggle) => {
				console.log("Status", toggleFilterStatus);
				setToggleFilterStatus(status => ({...status, [name]: (toggle === undefined ? !status[name] : toggle)}));
				console.log("Status After", toggleFilterStatus);
				return toggleFilterStatus[name];
			}
		}}
		{...props}
	/>;
}
