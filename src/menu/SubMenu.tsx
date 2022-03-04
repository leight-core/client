import {Menu, SubMenuProps} from "antd";
import React, {FC} from "react";
import {useTranslation} from "react-i18next";

export interface ISubMenuProps extends Partial<SubMenuProps> {
	id: string;
}

export const SubMenu: FC<ISubMenuProps> = (
	{
		id,
		...props
	}) => {
	const {t} = useTranslation();
	return <Menu.SubMenu title={t(id + ".menu")} {...props}/>;
};
