import {ITranslationsQuery} from "@leight-core/api";
import {DayjsProvider, I18NextProvider, IResponsiveProviderProps, LayoutBlockProvider, MenuSelectionProvider, ResponsiveContext, ResponsiveProvider, SiderCollapseProvider, TranslationLoader} from "@leight-core/client";
import {i18n} from "i18next";
import {FC, PropsWithChildren, ReactNode} from "react";
import {CookiesProvider} from "react-cookie";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";

export type IAppProps = PropsWithChildren<{
	logo?: ReactNode;
	useTranslationQuery?: ITranslationsQuery;
	queryClient: QueryClient;
	dayjs: any;
	i18next: i18n;
	defaultCollapsed?: boolean;
	responsiveProviderProps?: IResponsiveProviderProps;
}>;

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
		useTranslationQuery,
		dayjs,
		i18next,
		queryClient,
		responsiveProviderProps,
		defaultCollapsed,
		...props
	}) => {
	return <QueryClientProvider client={queryClient}>
		<ResponsiveProvider {...responsiveProviderProps}>
			<DayjsProvider dayjs={dayjs}>
				<I18NextProvider i18next={i18next}>
					<CookiesProvider>
						<TranslationLoader useQuery={useTranslationQuery} logo={logo}>
							<ResponsiveContext.Consumer>
								{browserContext => <SiderCollapseProvider defaultCollapsed={defaultCollapsed !== undefined ? defaultCollapsed : !browserContext.isMobile()}>
									<MenuSelectionProvider>
										<LayoutBlockProvider {...props}/>
									</MenuSelectionProvider>
								</SiderCollapseProvider>}
							</ResponsiveContext.Consumer>
						</TranslationLoader>
					</CookiesProvider>
				</I18NextProvider>
			</DayjsProvider>
		</ResponsiveProvider>
		<ReactQueryDevtools initialIsOpen={false}/>
	</QueryClientProvider>;
};
