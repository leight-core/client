import {
	useMenuSelectionContext,
	useOptionalSiderCollapseContext
}                  from "@leight-core/client";
import {
	Menu as CoolMenu,
	MenuProps
}                  from "antd";
import React, {FC} from "react";

export interface IMenuProps extends Partial<MenuProps> {
	extraOpenKeys?: string[];
}

export const Menu: FC<IMenuProps> = ({extraOpenKeys = [], ...props}) => {
	const menuSelectionContext = useMenuSelectionContext();
	const menuCollapseContext  = useOptionalSiderCollapseContext();
	return <CoolMenu
		mode={"inline"}
		selectedKeys={menuSelectionContext.selection}
		defaultOpenKeys={menuCollapseContext?.collapsed ? [] : extraOpenKeys}
		subMenuCloseDelay={0.35}
		{...props}
	/>;
};
