import {DrawerContext} from "@leight-core/client";
import {FC, PropsWithChildren, useState} from "react";

export type IDrawerProviderProps = PropsWithChildren<any>;

export const DrawerProvider: FC<IDrawerProviderProps> = props => {
	const [open, setOpen] = useState<boolean>(false);
	return <DrawerContext.Provider
		value={{
			open,
			setOpen,
			close: () => setOpen(false),
		}}
		{...props}
	/>;
};
