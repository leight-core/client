import {FilterContext} from "@leight-core/client";
import {cleanOf, merge} from "@leight-core/utils";
import empty from "is-empty";
import {PropsWithChildren, useState} from "react";

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
	/**
	 * Currently set filter; applied with defaults/applied.
	 */
	const [filter, setFilter] = useState<TFilter | undefined>(applyFilter || defaultFilter);
	/**
	 * Filter set by the user; this is useful to distinguish isEmpty() which could contain applied filters which
	 * should not be visible by the user
	 */
	const [request, setRequest] = useState<TFilter | undefined>();
	/**
	 * When used in a form, for example, this is the source used to build-up this filter.
	 */
	const [source, setSource] = useState();

	const $setFilter = (value?: TFilter, request?: TFilter, source?: any) => {
		const filter = cleanOf(value);
		setFilter(empty(filter) ? undefined : filter);
		setRequest(request);
		setSource(source);
	};
	return <FilterContext.Provider
		value={{
			name,
			filter,
			source,
			setFilter: (filter, source) => $setFilter({...filter, ...applyFilter}, filter, source),
			applyFilter: (apply, source) => $setFilter({...filter, ...apply, ...applyFilter}, apply, source),
			mergeFilter: (apply, source) => $setFilter(merge<any, any>(merge<any, any>(filter || {}, apply || {}), applyFilter || {}), apply, source),
			isEmpty: () => empty(request),
		}}
		{...props}
	/>;
}
