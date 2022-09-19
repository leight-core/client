import {VisibleContext} from "@leight-core/client";
import {FC, PropsWithChildren, useState} from "react";

export type IVisibleProviderProps = PropsWithChildren<{
	defaultVisible?: boolean;
}>;

export const VisibleProvider: FC<IVisibleProviderProps> = ({defaultVisible = false, ...props}) => {
	const [visible, setVisible] = useState<boolean>(defaultVisible);
	return <VisibleContext.Provider
		value={{
			visible,
			setVisible,
			show: () => setVisible(true),
			hide: () => setVisible(false),
		}}
		{...props}
	/>;
};
