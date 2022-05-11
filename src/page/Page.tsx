import {QuestionCircleOutlined} from "@ant-design/icons";
import {INavigate} from "@leight-core/api";
import {DrawerButton, EmptyPage, IDrawerButtonProps, IEmptyPageProps, IPageHeaderProps, PageHeader, Template, useMobile, useNavigate} from "@leight-core/client";
import {BreadcrumbProps, Card, CardProps, Divider} from "antd";
import Breadcrumb from "antd/lib/breadcrumb";
import * as React from "react";
import {FC, ReactNode} from "react";
import {Trans} from "react-i18next";

export type IPageBreadcrumb = BreadcrumbProps | React.ReactElement<typeof Breadcrumb>;

export interface IPageProps extends IEmptyPageProps {
	onBack?: (navigate: INavigate) => void;
	breadcrumbProps?: IPageBreadcrumb;
	icon?: ReactNode;
	/**
	 * When specified, help icon shows up with `withHelp.title` and `withHelp.content` Trans component used as DrawerButton.
	 */
	withHelp?: { title: string; subtitle?: string; content: string; drawerButtonProps?: Partial<IDrawerButtonProps> };
	extra?: ReactNode;
	header?: ReactNode;
	headerPostfix?: ReactNode;
	cardProps?: Partial<CardProps>;
	headerProps?: IPageHeaderProps;
	values?: any;
}

export const Page: FC<IPageProps> = (
	{
		breadcrumbProps,
		icon,
		withHelp,
		extra,
		cardProps,
		header,
		headerProps,
		headerPostfix,
		children,
		title,
		values,
		onBack,
		...props
	}) => {
	const mobile = useMobile();
	const navigate = useNavigate();
	if (!headerPostfix && withHelp) {
		headerPostfix = <DrawerButton
			title={`${withHelp}.title`}
			icon={<QuestionCircleOutlined/>}
			{...withHelp.drawerButtonProps}
		>
			<Template
				icon={icon}
				title={withHelp.title}
				subTitle={withHelp.subtitle}
				span={24}
				extra={<Divider type={"horizontal"}/>}
			>
				<Trans i18nKey={`${withHelp}.content`}/>
			</Template>
		</DrawerButton>;
	}
	return <EmptyPage title={title} values={values} {...props}>
		{header || <PageHeader
			onBack={onBack ? () => onBack(navigate) : undefined}
			headerPostfix={headerPostfix}
			title={title}
			values={values}
			icon={icon}
			extra={extra}
			ghost={false}
			breadcrumb={breadcrumbProps}
			style={mobile({padding: "4px 0 0 12px"})}
			{...headerProps}
		/>}
		<Card
			bodyStyle={mobile({padding: "0"}, {padding: "0 8px", paddingBottom: "16px", minHeight: "60vh"})}
			{...cardProps}
		>
			{children}
		</Card>
		<Card bordered={false}>
			&nbsp;
		</Card>
	</EmptyPage>;
};
