import {useDrawerContext} from "@leight-core/client";
import {Drawer as CoolDrawer, DrawerProps} from "antd";
import {FC} from "react";

export interface IDrawerProps extends Partial<DrawerProps> {
}

/**
 * Drawer controlled by a DrawerContext.
 */
export const Drawer: FC<IDrawerProps> = props => {
	const drawerContext = useDrawerContext();
	return <CoolDrawer
		placement={"right"}
		closable
		onClose={() => drawerContext.setVisible(false)}
		visible={drawerContext.visible}
		destroyOnClose
		{...props}
	/>;
};
