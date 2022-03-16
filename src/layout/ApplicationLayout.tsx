import React, {CSSProperties, FC, ReactNode, Suspense} from "react";
import {LoaderIcon, PlaceholderPage, useLayoutBlockContext} from "@leight-core/client";
import {Layout, Spin} from "antd";
import {BrowserView, MobileView} from "react-device-detect";

export interface IApplicationLayoutProps {
	/**
	 * Page (component layout) header.
	 */
	header: ReactNode;
	/**
	 * Page (component layout) footer.
	 */
	footer: ReactNode;
	/**
	 * Optional styling of layout content.
	 */
	contentStyle?: CSSProperties;
}

export const ApplicationLayout: FC<IApplicationLayoutProps> = ({header, footer, contentStyle, ...props}) => {
	const layoutBlockContext = useLayoutBlockContext();
	return <Layout>
		<Spin indicator={<LoaderIcon/>} spinning={layoutBlockContext.isBlocked()}>
			<BrowserView>
				{header}
				<Layout>
					<Layout>
						<Layout.Content style={{minHeight: "92vh", padding: '0 1em', ...contentStyle}}>
							<Suspense fallback={<PlaceholderPage/>} {...props}/>
							{footer && <Layout.Footer>
								{footer}
							</Layout.Footer>}
						</Layout.Content>
					</Layout>
				</Layout>
			</BrowserView>
			<MobileView>
				<Layout>
					<Layout.Content style={{minHeight: "100vh", ...contentStyle}}>
						<Suspense fallback={<PlaceholderPage/>} {...props}/>
						{footer && <Layout.Footer>
							{footer}
						</Layout.Footer>}
					</Layout.Content>
				</Layout>
			</MobileView>
		</Spin>
	</Layout>;
};
