import {ItemGroupContext} from "@leight-core/client";
import {FC} from "react";

export interface IItemGroupProviderProps {
	prefix: (string | number)[];
	translation?: string;
}

export const ItemGroupProvider: FC<IItemGroupProviderProps> = ({prefix, translation, ...props}) => {
	return <ItemGroupContext.Provider
		value={{
			prefix,
			translation,
		}}
		{...props}
	/>;
};
