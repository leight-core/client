import {BlockContextClass, IBlockProviderProps, LayoutBlockContext} from "@leight-core/client";
import {FC, useState} from "react";

export interface ILayoutBlockProviderProps extends Partial<IBlockProviderProps> {
	/**
	 * Default blocking state; "false" if not specified.
	 */
	locked?: boolean;
}

export const LayoutBlockProvider: FC<ILayoutBlockProviderProps> = ({locked = false, ...props}) => {
	return <LayoutBlockContext.Provider
		value={new BlockContextClass(useState<boolean>(locked), useState<number>(0))}
		{...props}
	/>;
};
