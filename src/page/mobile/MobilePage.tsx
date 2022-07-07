import {INavigate, IQueryParams} from "@leight-core/api";
import {MobileContent, PageProvider, useIsMobile, useMenuSelectionContext, useNavigate} from "@leight-core/client";
import {isString} from "@leight-core/utils";
import {Space} from "antd";
import {NavBar} from "antd-mobile";
import Head from "next/head";
import {ComponentProps, FC, PropsWithChildren, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export type IMobilePageProps = PropsWithChildren<{
	header?: ReactNode;
	icon?: ReactNode;
	/**
	 * Selected menu items.
	 */
	menuSelection?: string[];
	/**
	 * If provided, page title will be updated (tab name). Must be explicitly provided to change a title.
	 */
	title?: string;
	/**
	 * Page Tab (browser tab/window name) title.
	 *
	 * If complex translation is used, this should be used with simple text.
	 */
	tabTitle?: string;
	values?: Record<string, any>;
	footer?: ReactNode;
	navbarProps?: Partial<ComponentProps<typeof NavBar>>;
	onBack?(navigate: INavigate<IQueryParams>): void;
}>

export const MobilePage: FC<IMobilePageProps> = (
	{
		header,
		icon,
		title,
		children,
		footer,
		tabTitle,
		values,
		menuSelection = [],
		onBack,
		navbarProps,
	}) => {
	const isMobile = useIsMobile();
	const navigate = useNavigate();
	const {t} = useTranslation();
	useMenuSelectionContext().useSelection(menuSelection);
	if (!isMobile) {
		return null;
	}
	tabTitle = tabTitle || (title ? `${title}.title` : undefined);
	return <MobileContent>
		<PageProvider>
			{tabTitle && <Head><title key={"title"}>{t(tabTitle, values)}</title></Head>}
			<div style={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				backgroundColor: "#FFF",
			}}>
				<div style={{
					flex: 0,
					borderBottom: "solid 1px var(--adm-color-border)",
				}}>
					{header || (header !== null && <NavBar
						backArrow={!!onBack}
						onBack={() => onBack?.(navigate)}
						{...navbarProps}
					>
						<Space size={4}>
							{icon}
							{isString(title) ? t(`${title}.title`) : title}
						</Space>
					</NavBar>)}
				</div>
				<div
					style={{
						flex: 1,
						display: "flex",
						justifyContent: "start",
						alignItems: "start",
						overflow: "auto",
					}}
				>
					<div style={{
						width: "100vw",
						overflow: "auto",
					}}>
						{children}
					</div>
				</div>
				{footer && <div
					style={{
						flex: 0,
						borderTop: "solid 1px var(--adm-color-border)",
					}}
				>
					{footer}
				</div>}
			</div>
		</PageProvider>
	</MobileContent>;
};
