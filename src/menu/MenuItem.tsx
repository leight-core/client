import {IQueryParams} from "@leight-core/api";
import {LinkTo} from "@leight-core/client";
import {Menu, MenuItemProps} from "antd";
import {FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface IMenuItemProps extends Partial<MenuItemProps> {
	/**
	 * Menu item title, goes through translation.
	 */
	title: string;
	/**
	 * Menu item href, goes through a link generator.
	 */
	href: string;
	/**
	 * Menu icon
	 */
	icon: ReactNode;
	/**
	 * Optional params for link generator.
	 */
	query?: IQueryParams | void;
}

export const MenuItem: FC<IMenuItemProps> = ({title, href, icon, query, ...props}) => {
	const {t} = useTranslation();
	return <Menu.Item icon={icon} key={href} {...props}>
		<LinkTo href={href} query={query}>
			{t(title)}
		</LinkTo>
	</Menu.Item>;
};

/**
 * Because MenuItem component **must have** a key which is duplicate with an ID (as a key is not possible to read),
 * this function let's user create a menu item with just an ID and icon.
 *
 * Basically it has the same behavior as MenuItem component.
 */
export function CreateMenuItem(title: string, href: string, icon: ReactNode, query?: IQueryParams | void, rest?: Partial<IMenuItemProps>) {
	return <MenuItem title={title} key={href} href={href} icon={icon} query={query} {...rest}/>;
}
