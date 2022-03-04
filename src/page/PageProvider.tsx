import {PageContext} from "@leight-core/client";
import {FC} from "react";

export interface IPageProviderProps {
}

export const PageProvider: FC<IPageProviderProps> = props => {
	return <PageContext.Provider
		value={{}}
		{...props}
	/>;
};
