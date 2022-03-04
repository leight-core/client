import {Menu} from "antd";
import {MenuItemGroupProps} from "rc-menu/lib/MenuItemGroup";
import React, {FC} from "react";
import {useTranslation} from "react-i18next";

export interface IMenuGroupProps extends Partial<MenuItemGroupProps> {
	id: string;
}

export const MenuGroup: FC<IMenuGroupProps> = (
	{
		id,
		...props
	}) => {
	const {t} = useTranslation();
	return (
		<Menu.ItemGroup title={t(id + ".menu")} {...props}/>
	);
};
