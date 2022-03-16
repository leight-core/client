import {EmptyPage, IEmptyPageProps, IPageHeaderProps, PageHeader, useIsMobile, useNavigate} from "@leight-core/client";
import {BreadcrumbProps, Card, CardProps, Divider} from "antd";
import Breadcrumb from "antd/lib/breadcrumb";
import * as React from "react";
import {FC, ReactNode} from "react";
import {INavigate} from "@leight-core/api";

export type IPageBreadcrumb = BreadcrumbProps | React.ReactElement<typeof Breadcrumb>;

export interface IPageProps extends IEmptyPageProps {
	onBack?: (navigate: INavigate) => void;
	breadcrumbProps?: IPageBreadcrumb;
	breadcrumbMobileProps?: IPageBreadcrumb;
	breadcrumbBrowserProps?: IPageBreadcrumb;
	icon?: ReactNode;
	extra?: ReactNode;
	extraMobile?: ReactNode;
	extraBrowser?: ReactNode;
	header?: ReactNode;
	cardProps?: Partial<CardProps>;
	headerProps?: IPageHeaderProps;
}

export const Page: FC<IPageProps> = (
	{
		breadcrumbProps,
		breadcrumbMobileProps,
		breadcrumbBrowserProps,
		icon,
		extra,
		extraMobile,
		extraBrowser,
		cardProps,
		header,
		headerProps,
		children,
		title,
		onBack,
		...props
	}) => {
	const isMobile = useIsMobile();
	const navigate = useNavigate();
	extra = extra || (isMobile ? extraMobile : extraBrowser);
	breadcrumbProps = breadcrumbProps || (isMobile ? breadcrumbMobileProps : breadcrumbBrowserProps);
	return <EmptyPage title={title} {...props}>
		{header || <PageHeader
			onBack={onBack ? () => onBack(navigate) : undefined}
			title={title}
			icon={icon}
			extra={extra}
			ghost={false}
			breadcrumb={breadcrumbProps}
			style={isMobile ? {padding: "4px 0 0 12px"} : undefined}
			{...headerProps}
		/>}
		<Card
			bodyStyle={isMobile ? {padding: "0"} : {padding: "0 8px"}}
			{...cardProps}
		>
			{children}
			<Divider/>
		</Card>
	</EmptyPage>;
};
