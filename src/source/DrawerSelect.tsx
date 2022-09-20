import Icon from "@ant-design/icons";
import {ISelection, IWithIdentity} from "@leight-core/api";
import {BubbleButton, Drawer, FulltextBar, ISelectionProviderProps, ITranslateProps, SelectionContext, SelectionProvider, Translate, useSourceContext, useVisibleContext} from "@leight-core/client";
import {Col, Row, Space} from "antd";
import {CheckList, DotLoading, InfiniteScroll} from "antd-mobile";
import {CheckOutline} from "antd-mobile-icons";
import {ReactNode} from "react";
import {IoTrailSignOutline} from "react-icons/io5";

export const toSingleSelection = ({single}: ISelection<IWithIdentity>) => single?.id;

export const toMultiSelection = ({selected}: ISelection<IWithIdentity>) => selected;

export interface IDrawerSelectProps<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any> {
	onChange?(value?: TOnChange): void;

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

	withFulltext?: boolean;

	render(item: TItem): ReactNode;

	toChange?(selection: ISelection<TItem>): TOnChange | undefined;

	toPreview?(selection?: ISelection<TItem>): ReactNode;
}

export function DrawerSelect<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any>(
	{
		onChange,
		translation,
		defaultSelection,
		selectionProviderProps,
		render,
		withFulltext = true,
		toChange = selection => toSingleSelection(selection) as TOnChange,
		toPreview = event => event?.single ? render(event.single) : <Translate {...translation} text={"placeholder"}/>,
	}: IDrawerSelectProps<TItem, TOnChange>) {
	const sourceContext = useSourceContext<TItem>();
	const visibleContext = useVisibleContext();
	return <SelectionProvider<TItem>
		type={"single"}
		defaultSelection={defaultSelection}
		onSelection={selection => {
			console.log("Handling selection", selection, "change", toChange(selection));
			onChange?.(toChange(selection));
		}}
		{...selectionProviderProps}
	>
		<SelectionContext.Consumer>
			{selectionContext => <>
				<Drawer
					open={visibleContext.visible}
					onClose={e => {
						e.stopPropagation();
						visibleContext.hide();
					}}
					destroyOnClose
					bodyStyle={{padding: 0}}
					translation={translation}
				>
					<BubbleButton
						icon={<CheckOutline fontSize={32}/>}
						onClick={e => {
							e.stopPropagation();
							selectionContext.handleSelection();
							visibleContext.hide();
						}}
					/>
					{withFulltext ? <Row justify={"center"} style={{margin: "0.75em"}}>
						<Col span={24}>
							<FulltextBar/>
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
									onClick={e => {
										e.stopPropagation();
										selectionContext.item(item);
									}}
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
				{toPreview(selectionContext.selection())}
			</>}
		</SelectionContext.Consumer>
	</SelectionProvider>;
}
