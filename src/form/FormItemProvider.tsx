import {FC} from "react";
import {FormItemContext} from "@leight-core/client";
import {IFormItemContext} from "@leight-core/api";

export interface IFormItemProviderProps {
	context: IFormItemContext;
}

export const FormItemProvider: FC<IFormItemProviderProps> = ({context, ...props}) => {
	return <FormItemContext.Provider
		value={context}
		{...props}
	/>
}
