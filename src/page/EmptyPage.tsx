import {BlockProvider, PageProvider, ScrollToTop, useBlockContext, useLayoutBlockContext, useMenuSelectionContext, useSiderCollapseContext} from "@leight-core/client";
import {Spin} from "antd";
import Head from "next/head";
import {FC, useEffect} from "react";
import {useTranslation} from "react-i18next";

export interface IEmptyPageProps {
	/**
	 * If provided, page title will be updated (tab name). Must be explicitly provided to change a title.
	 */
	title?: string;
	/**
	 * Should the sider be collapsed?
	 */
	collapsed?: boolean;
	/**
	 * Initial blocking state of a view; when true, view shows a loader.
	 *
	 * Defaults to `false`.
	 */
	blocked?: boolean;
	/**
	 * Selected menu items.
	 */
	menuSelection?: string[];
}

const EmptyPageInternal: FC = props => {
	const {t} = useTranslation();
	const blockContext = useBlockContext();
	return <Spin spinning={blockContext.isBlocked()} indicator={null as any} tip={t("component.loading") as string} {...props}/>;
};

/**
 * Quite simple empty page without any additional features.
 */
export const EmptyPage: FC<IEmptyPageProps> = (
	{
		title,
		blocked = false,
		collapsed,
		menuSelection = [],
		...props
	}) => {
	const {t} = useTranslation();
	const blockContext = useLayoutBlockContext();
	useMenuSelectionContext().useSelection(menuSelection);
	useSiderCollapseContext().useCollapse(collapsed, true);
	useEffect(() => {
		blockContext.unblock(true);
	}, []);
	return <PageProvider>
		{title && <Head><title key={"title"}>{t(title + ".title")}</title></Head>}
		<ScrollToTop/>
		<BlockProvider locked={blocked}>
			<EmptyPageInternal {...props}/>
		</BlockProvider>
	</PageProvider>;
};
