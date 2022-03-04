import {isString} from "@leight-core/client";
import {PageHeader as CoolPageHeader, PageHeaderProps as CoolPageHeaderProps, Space} from "antd";
import {FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface IPageHeaderProps extends Partial<CoolPageHeaderProps> {
	icon?: ReactNode;
}

export const PageHeader: FC<IPageHeaderProps> = ({title, icon, ...props}) => {
	const {t} = useTranslation();
	const _title = isString(title) ? <span>{t(title + ".title")}</span> : title;
	return <CoolPageHeader
		title={icon ? <Space>{icon}{_title}</Space> : _title}
		{...props}
	/>;
};
