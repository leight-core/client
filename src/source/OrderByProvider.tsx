import {OrderByContext} from "@leight-core/client";
import {PropsWithChildren, useState} from "react";

export interface IOrderByProviderProps<TOrderBy = any> {
	/**
	 * Default pre-set order; could be overridden by a user. Apply filter prop takes precedence.
	 */
	defaultOrderBy?: TOrderBy;
}

export function OrderByProvider<TOrderBy, >({defaultOrderBy, ...props}: PropsWithChildren<IOrderByProviderProps<TOrderBy>>) {
	const [orderBy, setOrderBy] = useState<TOrderBy | undefined>(defaultOrderBy);
	return <OrderByContext.Provider
		value={{
			orderBy,
			setOrderBy,
		}}
		{...props}
	/>;
}
