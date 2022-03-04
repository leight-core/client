import {i18n} from "i18next";
import {FC, ReactNode} from "react";
import {CookiesProvider} from "react-cookie";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import {
	bootstrap,
	DayjsProvider,
	I18NextProvider,
	IResponsiveProviderProps,
	LayoutBlockProvider,
	LinkProvider,
	MenuSelectionProvider,
	ResponsiveContext,
	ResponsiveProvider,
	SiderCollapseProvider,
	TranslationLoader
} from "@leight-core/client";

export interface IAppProps {
	logo?: ReactNode;
	translationLink?: string;
	queryClient: QueryClient;
	dayjs: any;
	i18next: i18n;
	defaultCollapsed?: boolean;
	responsiveProviderProps?: IResponsiveProviderProps;
}

/**
 * Common default Application:
 *
 * - uses default server-side config loading (for discovery)
 * - uses server-side discovery by default
 * - uses server-side translations by default (with a setup of i18n)
 * - uses server-side default user login check
 */
export const App: FC<IAppProps> = (
	{
		logo,
		translationLink = "/api/shared/translation",
		dayjs,
		i18next,
		queryClient,
		responsiveProviderProps,
		defaultCollapsed,
		...props
	}) => {
	bootstrap();
	return <QueryClientProvider client={queryClient}>
		<ResponsiveProvider {...responsiveProviderProps}>
			<DayjsProvider dayjs={dayjs}>
				<I18NextProvider i18next={i18next}>
					<LinkProvider>
						<CookiesProvider>
							<TranslationLoader link={translationLink} logo={logo}>
								<ResponsiveContext.Consumer>
									{browserContext => <SiderCollapseProvider defaultCollapsed={defaultCollapsed !== undefined ? defaultCollapsed : !browserContext.isMobile()}>
										<MenuSelectionProvider>
											<LayoutBlockProvider {...props}/>
										</MenuSelectionProvider>
									</SiderCollapseProvider>}
								</ResponsiveContext.Consumer>
							</TranslationLoader>
						</CookiesProvider>
					</LinkProvider>
				</I18NextProvider>
			</DayjsProvider>
		</ResponsiveProvider>
		<ReactQueryDevtools initialIsOpen={false}/>
	</QueryClientProvider>;
};
