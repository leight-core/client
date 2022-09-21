import Icon from "@ant-design/icons";
import {ISelection, ISelectionContext, ISelectionType, IWithIdentity} from "@leight-core/api";
import {BubbleButton, Drawer, FulltextBar, ISelectionProviderProps, ITranslateProps, OfSelection, SelectionContext, SelectionProvider, Translate, useOptionalFilterContext, useSourceContext, useVisibleContext} from "@leight-core/client";
import {Col, Row, Space, Typography} from "antd";
import {CheckList, DotLoading, InfiniteScroll} from "antd-mobile";
import {CheckOutline} from "antd-mobile-icons";
import {ReactNode} from "react";
import {IoTrailSignOutline} from "react-icons/io5";

export const toSingleSelection = ({single}: ISelection<IWithIdentity>) => single?.id;

export const toMultiSelection = ({selected}: ISelection<IWithIdentity>) => selected;

export interface IDrawerSelectProps<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any> {
	/**
	 * Currently selected value(s).
	 */
	value?: TOnChange;
	type?: ISelectionType;

	/**
	 * Callback used for FormItem compatibility.
	 *
	 * @param value
	 */
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

	/**
	 * Shows and enabled FulltextBar (under the hood using FilterContext with fulltext Query parameter)
	 */
	withFulltext?: boolean;

	/**
	 * Render the given item into the (selection) list.
	 *
	 * @param item
	 */
	render(item: TItem): ReactNode;

	/**
	 * Renders selected values in the form UI. When undefined is returned, placeholder is rendered.
	 *
	 * @param selection
	 */
	toPreview(selection?: ISelection<TItem>): ReactNode;

	/**
	 * Resulting selection converted into the form field data.
	 *
	 * @param selection
	 */
	toChange?(selection: ISelection<TItem>): TOnChange | undefined;

	/**
	 * Opposite of toChange: should select items in the selectionContext.
	 *
	 * @param value
	 * @param selectionContext
	 */
	ofSelection(value: TOnChange | undefined, selectionContext: ISelectionContext<TItem>): void;

	icon?: ReactNode;
}

export function DrawerSelect<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any>(
	{
		value,
		type = "single",
		onChange,
		translation,
		defaultSelection,
		selectionProviderProps,
		render,
		withFulltext = true,
		toChange = selection => toSingleSelection(selection) as TOnChange,
		ofSelection,
		toPreview,
		icon,
	}: IDrawerSelectProps<TItem, TOnChange>) {
	const sourceContext = useSourceContext<TItem>();
	const visibleContext = useVisibleContext();
	const filterContext = useOptionalFilterContext();

	const $toPreview = (selection?: ISelection<TItem>) => {
		const preview = toPreview(selection);
		return preview === undefined ? <Typography.Text type={"secondary"}><Translate {...translation} text={"placeholder"}/></Typography.Text> : preview;
	};

	return <SelectionProvider<TItem>
		type={type}
		defaultSelection={defaultSelection}
		onSelection={selection => {
			onChange?.(toChange(selection));
			filterContext?.setFilter({});
			sourceContext.reset();
		}}
		{...selectionProviderProps}
	>
		<SelectionContext.Consumer>
			{selectionContext => <>
				<OfSelection<TItem, TOnChange>
					ofSelection={ofSelection}
					value={value}
				/>
				<Drawer
					open={visibleContext.visible}
					onClose={e => {
						e.stopPropagation();
						visibleContext.hide();
					}}
					destroyOnClose
					bodyStyle={{padding: 0}}
					translation={translation}
					icon={icon}
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
				<Space>
					{icon ? <Typography.Text type={"secondary"}>{icon}</Typography.Text> : null}
					{$toPreview(selectionContext.selection())}
				</Space>
			</>}
		</SelectionContext.Consumer>
	</SelectionProvider>;
}
