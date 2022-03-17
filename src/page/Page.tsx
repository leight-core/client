import {EmptyPage, IEmptyPageProps, IPageHeaderProps, PageHeader, useMobile, useNavigate} from "@leight-core/client";
import {BreadcrumbProps, Card, CardProps} from "antd";
import Breadcrumb from "antd/lib/breadcrumb";
import * as React from "react";
import {FC, ReactNode} from "react";
import {INavigate} from "@leight-core/api";

export type IPageBreadcrumb = BreadcrumbProps | React.ReactElement<typeof Breadcrumb>;

export interface IPageProps extends IEmptyPageProps {
	onBack?: (navigate: INavigate) => void;
	breadcrumbProps?: IPageBreadcrumb;
	icon?: ReactNode;
	extra?: ReactNode;
	header?: ReactNode;
	headerPostfix?: ReactNode;
	cardProps?: Partial<CardProps>;
	headerProps?: IPageHeaderProps;
}

export const Page: FC<IPageProps> = (
	{
		breadcrumbProps,
		icon,
		extra,
		cardProps,
		header,
		headerProps,
		headerPostfix,
		children,
		title,
		onBack,
		...props
	}) => {
	const mobile = useMobile();
	const navigate = useNavigate();
	return <EmptyPage title={title} {...props}>
		{header || <PageHeader
			onBack={onBack ? () => onBack(navigate) : undefined}
			headerPostfix={headerPostfix}
			title={title}
			icon={icon}
			extra={extra}
			ghost={false}
			breadcrumb={breadcrumbProps}
			style={mobile({padding: "4px 0 0 12px"})}
			{...headerProps}
		/>}
		<Card
			bodyStyle={mobile({padding: "0"}, {padding: "0 8px", minHeight: '60vh'})}
			{...cardProps}
		>
			{children}
		</Card>
		<Card bordered={false}>
			&nbsp;
		</Card>
	</EmptyPage>;
};
