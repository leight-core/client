import {BlockContext, BlockContextClass} from "@leight-core/client";
import {FC, useState} from "react";

export interface IBlockProviderProps {
	/**
	 * Default blocking state; "false" if not specified.
	 */
	locked?: boolean;
}

export const BlockProvider: FC<IBlockProviderProps> = ({locked = false, ...props}) => {
	return <BlockContext.Provider
		value={new BlockContextClass(useState<boolean>(locked), useState<number>(0))}
		{...props}
	/>;
};
