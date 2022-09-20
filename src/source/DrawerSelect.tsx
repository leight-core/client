import Icon from "@ant-design/icons";
import {IWithIdentity} from "@leight-core/api";
import {Drawer, ISelectionProviderProps, ITranslateProps, SelectionContext, SelectionProvider, useSourceContext, VisibleContext, VisibleProvider} from "@leight-core/client";
import {Space} from "antd";
import {CheckList, DotLoading, InfiniteScroll} from "antd-mobile";
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

	render(item: TItem): ReactNode;
}>;

export function DrawerSelect<TItem extends Record<string, any> & IWithIdentity = any>(
	{
		translation,
		defaultSelection,
		selectionProviderProps,
		render,
		children,
	}: IDrawerSelectProps<TItem>) {
	const sourceContext = useSourceContext<TItem>();
	return <SelectionProvider<TItem>
		type={"single"}
		defaultSelection={defaultSelection}
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
						</Drawer>
						{children}
					</>}
				</VisibleContext.Consumer>
			</VisibleProvider>}
		</SelectionContext.Consumer>
	</SelectionProvider>;
}
