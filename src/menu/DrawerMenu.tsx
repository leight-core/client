import {MenuOutlined} from "@ant-design/icons";
import {
	DrawerButton,
	IDrawerButtonProps,
	useMobile
}                     from "@leight-core/client";
import {Menu}         from "antd";
import {
	ComponentProps,
	FC
}                     from "react";

export interface IDrawerMenuProps extends Omit<Partial<IDrawerButtonProps>, "children"> {
	items?: ComponentProps<typeof Menu>["items"];
	menuProps?: Partial<ComponentProps<typeof Menu>>;
}

export const DrawerMenu: FC<IDrawerMenuProps> = ({items, menuProps, ...props}) => {
	const mobile = useMobile();
	return <DrawerButton
		type={"text"}
		drawerProps={{
			headerStyle: mobile({padding: "8px 4px"}),
			bodyStyle:   {padding: 0},
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
