import Icon from "@ant-design/icons";
import {ISelection, IWithIdentity} from "@leight-core/api";
import {BubbleButton, Drawer, ISelectionProviderProps, ITranslateProps, SelectionContext, SelectionProvider, useOptionalCursorContext, useOptionalFilterContext, useSourceContext, VisibleContext, VisibleProvider} from "@leight-core/client";
import {Col, Row, Space} from "antd";
import {CheckList, DotLoading, InfiniteScroll, SearchBar} from "antd-mobile";
import {CheckOutline} from "antd-mobile-icons";
import {PropsWithChildren, ReactNode} from "react";
import {IoTrailSignOutline} from "react-icons/io5";

export type IDrawerSelectProps<TItem extends Record<string, any> & IWithIdentity = any> = PropsWithChildren<{
	/**
	 * General translation props used inside this component.
	 */
	translation?: ITranslateProps;
	/**
	 * Optional props for the Selection Provider.
	 */
	selectionProviderProps?: ISelectionProviderProps<TItem>;
	/**
	 * Default selection (shortcut to selectionProviderProps)
	 */
	defaultSelection?: Record<string, TItem>;
	/**
	 * Submitted selection.
	 *
	 * @param event
	 */
	onSelection?(event: ISelection<TItem>): void;

	withFulltext?: boolean;

	render(item: TItem): ReactNode;
}>;

export function DrawerSelect<TItem extends Record<string, any> & IWithIdentity = any>(
	{
		translation,
		defaultSelection,
		onSelection,
		selectionProviderProps,
		render,
		withFulltext = true,
		children,
	}: IDrawerSelectProps<TItem>) {
	const sourceContext = useSourceContext<TItem>();
	const filterContext = useOptionalFilterContext();
	const cursorContext = useOptionalCursorContext();
	if (withFulltext && !filterContext) {
		console.warn(`Using DrawerSelect list ${sourceContext.name} with fulltext and without filter context!`);
	}
	return <SelectionProvider<TItem>
		type={"single"}
		defaultSelection={defaultSelection}
		onSelection={onSelection}
		{...selectionProviderProps}
	>
		<SelectionContext.Consumer>
			{selectionContext => <VisibleProvider>
				<VisibleContext.Consumer>
					{visibleContext => <>
						<Drawer
							open={visibleContext.visible}
							onClose={() => visibleContext.hide()}
							destroyOnClose
							bodyStyle={{padding: 0}}
							translation={translation}
						>
							<BubbleButton
								icon={<CheckOutline/>}
								onClick={() => selectionContext.handleSelection()}
							/>
							{withFulltext ? <Row justify={"center"} style={{margin: "0.75em"}}>
								<Col span={24}>
									<SearchBar
										onSearch={value => {
											sourceContext.reset();
											filterContext?.setFilter({fulltext: value});
											setTimeout(() => cursorContext?.setPage(0), 0);
										}}
										onClear={() => {
											sourceContext.reset();
											filterContext?.setFilter();
											setTimeout(() => cursorContext?.setPage(0), 0);
										}}
									/>
								</Col>
							</Row> : null}
							<Row>
								<Col span={24}>
									<CheckList
										value={selectionContext.toSelection()}
									>
										{sourceContext.data().map(item => <CheckList.Item
											key={item.id}
											value={item.id}
											onClick={() => selectionContext.item(item)}
										>
											{render(item)}
										</CheckList.Item>)}
									</CheckList>

									<InfiniteScroll
										loadMore={async () => sourceContext.more(true)}
										hasMore={sourceContext.hasMore()}
									>
										<Space>
											{sourceContext.result.isFetching || sourceContext.hasMore() ? (
												<DotLoading/>
											) : (
												<Icon component={IoTrailSignOutline}/>
											)}
										</Space>
									</InfiniteScroll>
								</Col>
							</Row>
						</Drawer>
						{children}
					</>}
				</VisibleContext.Consumer>
			</VisibleProvider>}
		</SelectionContext.Consumer>
	</SelectionProvider>;
}
