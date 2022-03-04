import {DrawerContext} from "@leight-core/client";
import {FC, useState} from "react";

export interface IDrawerProviderProps {
}

export const DrawerProvider: FC<IDrawerProviderProps> = props => {
	const [visible, setVisible] = useState<boolean>(false);
	return <DrawerContext.Provider
		value={{
			visible,
			setVisible,
			hide: () => setVisible(false),
		}}
		{...props}
	/>;
};
