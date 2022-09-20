import {MenuOutlined} from "@ant-design/icons";
import {DrawerButton, IDrawerButtonProps, useMobile} from "@leight-core/client";
import {Menu} from "antd";
import {ComponentProps, FC, ReactNode} from "react";

export interface IDrawerMenuProps extends Omit<Partial<IDrawerButtonProps>, "children"> {
	header?: ReactNode;
	items?: ComponentProps<typeof Menu>["items"];
	menuProps?: Partial<ComponentProps<typeof Menu>>;
}

export const DrawerMenu: FC<IDrawerMenuProps> = ({header, items, menuProps, ...props}) => {
	const mobile = useMobile();
	return <DrawerButton
		type={"text"}
		title={header}
		drawerProps={{
			headerStyle: mobile({padding: "8px 4px"}),
			bodyStyle: {padding: 0},
		}}
		width={400}
		icon={<MenuOutlined/>}
		{...props}
	>
		<Menu
			selectable={false}
			items={items}
			{...menuProps}
		/>
	</DrawerButton>;
};
