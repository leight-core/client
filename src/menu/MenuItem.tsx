import {IQueryParams} from "@leight-core/api";
import {LinkTo} from "@leight-core/client";
import {ItemType} from "antd/lib/menu/hooks/useItems";
import {FC, ReactNode} from "react";
import {Trans, useTranslation} from "react-i18next";

export interface IMenuItemProps {
	/**
	 * Menu item title, goes through translation.
	 */
	title: string;
	/**
	 * Menu item href, goes through a link generator.
	 */
	href: string;
	/**
	 * Optional params for link generator.
	 */
	query?: IQueryParams | void;
}

export const MenuItem: FC<IMenuItemProps> = ({title, href, query}) => {
	const {t} = useTranslation();
	return <LinkTo href={href} query={query}>
		{t(title)}
	</LinkTo>;
};

/**
 * Because MenuItem component **must have** a key which is duplicate with an ID (as a key is not possible to read),
 * this function let's user create a menu item with just an ID and icon.
 *
 * Basically it has the same behavior as MenuItem component.
 */
export function CreateMenuItem(title: string, href: string, icon: ReactNode, query?: IQueryParams | void, rest?: Partial<ItemType>): ItemType {
	return {
		icon,
		key: title,
		label: <MenuItem title={title} href={href} query={query}/>,
		...rest,
	};
}

export function CreateMenuGroup(title: string, icon: ReactNode, items: ItemType[], rest?: Partial<ItemType>): ItemType {
	return {
		icon,
		key: title,
		label: <Trans i18nKey={title}/>,
		children: items,
		...rest,
	};
}
