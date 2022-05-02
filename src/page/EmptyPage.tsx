import {BlockProvider, PageProvider, ScrollToTop, useBlockContext, useLayoutBlockContext, useMenuSelectionContext, useSiderCollapseContext} from "@leight-core/client";
import {Spin} from "antd";
import Head from "next/head";
import {FC, PropsWithChildren, useEffect} from "react";
import {useTranslation} from "react-i18next";

export type IEmptyPageProps = PropsWithChildren<{
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
	values?: any;
}>;

const EmptyPageInternal: FC<PropsWithChildren<any>> = ({children}) => {
	const {t} = useTranslation();
	const blockContext = useBlockContext();
	return <Spin spinning={blockContext.isBlocked()} indicator={null as any} tip={t("component.loading") as string}>
		{children}
	</Spin>;
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
		values,
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
		{title && <Head><title key={"title"}>{t(title + ".title", {data: values})}</title></Head>}
		<ScrollToTop/>
		<BlockProvider locked={blocked}>
			<EmptyPageInternal {...props}/>
		</BlockProvider>
	</PageProvider>;
};
