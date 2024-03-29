import {QuestionCircleOutlined} from "@ant-design/icons";
import {
	INavigate,
	IQueryParams
}                               from "@leight-core/api";
import {
	BrowserPageHeader,
	DrawerButton,
	EmptyPage,
	IBrowserPageHeaderProps,
	IDrawerButtonProps,
	IEmptyPageProps,
	Template,
	useIsBrowser,
	useNavigate
}                               from "@leight-core/client";
import {
	BreadcrumbProps,
	Card,
	CardProps,
	Divider
}                               from "antd";
import Breadcrumb               from "antd/lib/breadcrumb";
import {
	FC,
	ReactNode
}                               from "react";
import {Trans}                  from "react-i18next";

export type IPageBreadcrumb =
	BreadcrumbProps
	| React.ReactElement<typeof Breadcrumb>;

export interface IBrowserPageProps extends IEmptyPageProps {
	onBack?(navigate: INavigate<IQueryParams>): void;

	breadcrumbProps?: IPageBreadcrumb;
	icon?: ReactNode;
	/**
	 * When specified, help icon shows up with `withHelp.title` and `withHelp.content` Trans component used as DrawerButton.
	 */
	withHelp?: { translation: string; drawerButtonProps?: Partial<IDrawerButtonProps> };
	extra?: ReactNode;
	extraSize?: number;
	header?: ReactNode;
	footer?: ReactNode;
	headerPostfix?: ReactNode;
	cardProps?: Partial<CardProps>;
	headerProps?: IBrowserPageHeaderProps;
	values?: any;
	/**
	 * Components used for translation interpolation. See react-i18n Trans docs.
	 */
	components?: IBrowserPageHeaderProps["components"];
}

export const BrowserPage: FC<IBrowserPageProps> = (
	{
		breadcrumbProps,
		icon,
		withHelp,
		extra,
		extraSize,
		cardProps,
		header,
		footer,
		headerProps,
		headerPostfix,
		children,
		title,
		values,
		components,
		onBack,
		...props
	}) => {
	const isBrowser = useIsBrowser();
	const navigate  = useNavigate<IQueryParams>();
	if (!isBrowser) {
		return null;
	}
	if (!headerPostfix && withHelp) {
		headerPostfix = <DrawerButton
			translation={{
				text: `${withHelp.translation}.title`,
			}}
			icon={<QuestionCircleOutlined/>}
			type={"link"}
			size={"large"}
			width={720}
			tooltip={`${withHelp.translation}.help.tooltip`}
			{...withHelp.drawerButtonProps}
		>
			<Template
				icon={icon}
				label={withHelp.translation}
				span={24}
				extra={<Divider type={"horizontal"}/>}
			>
				<Trans i18nKey={`${withHelp.translation}.content`}/>
			</Template>
		</DrawerButton>;
	}
	return <EmptyPage title={title} values={values} {...props}>
		{header || (header !== null && <BrowserPageHeader
			onBack={onBack ? () => onBack(navigate) : undefined}
			headerPostfix={headerPostfix}
			title={title}
			values={values}
			components={components}
			icon={icon}
			extra={extra && extraSize ? <div style={{width: `${extraSize}em`}}>{extra}</div> : extra}
			ghost={false}
			breadcrumb={breadcrumbProps}
			footer={footer}
			{...headerProps}
		/>)}
		<Card
			bodyStyle={{paddingBottom: "16px"}}
			{...cardProps}
		>
			{children}
		</Card>
	</EmptyPage>;
};
