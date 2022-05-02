import {BlockContextClass, FormBlockContext} from "@leight-core/client";
import {FC, PropsWithChildren, useState} from "react";

export type IFormBlockProviderProps = PropsWithChildren<unknown>;

export const FormBlockProvider: FC<IFormBlockProviderProps> = props => {
	return <FormBlockContext.Provider
		value={new BlockContextClass(useState<boolean>(false), useState<number>(0))}
		{...props}
	/>;
};
