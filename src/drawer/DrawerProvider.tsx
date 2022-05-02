import {DrawerContext} from "@leight-core/client";
import {FC, PropsWithChildren, useState} from "react";

export type IDrawerProviderProps = PropsWithChildren<any>;

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
