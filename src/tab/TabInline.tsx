import {Space} from "antd";
import {FC} from "react";
import {useTranslation} from "react-i18next";

export interface ITabInlineProps {
	title?: string;
	icon?: string;
}

export const TabInline: FC<ITabInlineProps> = ({title, icon}) => {
	const {t} = useTranslation();
	return <Space size={0}>
		{icon}
		{title && t(title)}
	</Space>;
};
