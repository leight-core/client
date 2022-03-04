import {FC, useState} from "react";
import {BlockContextClass, FormBlockContext} from "@leight-core/client";

export interface IFormBlockProviderProps {
}

export const FormBlockProvider: FC<IFormBlockProviderProps> = props => {
	return <FormBlockContext.Provider
		value={new BlockContextClass(useState<boolean>(false), useState<number>(0))}
		{...props}
	/>
}
