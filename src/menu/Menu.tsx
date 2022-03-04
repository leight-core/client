import {Menu as CoolMenu, MenuProps} from "antd";
import React, {FC} from "react";
import {useMenuSelectionContext, useSiderCollapseContext} from "@leight-core/client";

export interface IMenuProps extends Partial<MenuProps> {
	extraOpenKeys?: string[];
}

export const Menu: FC<IMenuProps> = ({extraOpenKeys = [], ...props}) => {
	const menuSelectionContext = useMenuSelectionContext();
	const menuCollapseContext = useSiderCollapseContext();
	return <CoolMenu
		mode={"inline"}
		selectedKeys={menuSelectionContext.selection}
		defaultOpenKeys={menuCollapseContext.collapsed ? [] : extraOpenKeys}
		subMenuCloseDelay={0.35}
		inlineCollapsed={menuCollapseContext.collapsed}
		{...props}
	/>;
};
