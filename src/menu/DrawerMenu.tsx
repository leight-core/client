import {MenuOutlined} from "@ant-design/icons";
import {DrawerButton, IDrawerButtonProps, useIsMobile} from "@leight-core/client";
import {Menu} from "antd";
import {PushState} from "antd/lib/drawer";
import {FC, ReactNode} from "react";
import {PlacementType} from "@leight-core/api";

export interface IDrawerMenuProps extends Partial<IDrawerButtonProps> {
	header?: ReactNode;
	placement?: PlacementType;
	push?: boolean | PushState;
}

export const DrawerMenu: FC<IDrawerMenuProps> = ({children, header, placement = "left", push = false, ...props}) => {
	const isMobile = useIsMobile();
	return <DrawerButton
		type={"text"}
		drawerProps={{
			title: header,
			headerStyle: isMobile ? {padding: "8px 4px"} : undefined,
			bodyStyle: {padding: 0},
			placement,
			push,
		}}
		width={400}
		icon={<MenuOutlined/>}
		{...props}
	>
		<Menu selectable={false}>
			{children}
		</Menu>
	</DrawerButton>;
};
