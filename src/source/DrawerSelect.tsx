import Icon from "@ant-design/icons";
import {IFilterContext, ISelection, ISelectionContext, ISelectionType, ISourceContext, IWithIdentity} from "@leight-core/api";
import {
	BubbleButton,
	Centered,
	Drawer,
	FulltextBar,
	IOfSelection,
	ISelectionProviderProps,
	ITranslateProps,
	OfSelection,
	SelectionContext,
	SelectionProvider,
	Translate,
	useOptionalBlockContext,
	useOptionalFilterContext,
	useSourceContext,
	useVisibleContext
} from "@leight-core/client";
import {Col, Row, Space, Typography} from "antd";
import {CheckList, DotLoading, InfiniteScroll} from "antd-mobile";
import {CheckOutline} from "antd-mobile-icons";
import {PropsWithChildren, ReactNode} from "react";
import {IoTrailSignOutline} from "react-icons/io5";

export const toSingleSelection = ({single}: ISelection<IWithIdentity>) => single?.id;

export const toMultiSelection = ({selected}: ISelection<IWithIdentity>) => selected;

export interface IDrawerSelectRenderList<TItem> {
	sourceContext: ISourceContext<TItem>;
	selectionContext: ISelectionContext<TItem>;
	filterContext: IFilterContext | null;

	render(item: TItem): ReactNode;
}

export type IDrawerSelectProps<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any> = PropsWithChildren<{
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
	onSelection?(selection: ISelection<TItem>): void;

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
	 * Override an internal list renderer (the list itself is upon this method).
	 */
	renderList?(props: IDrawerSelectRenderList<TItem>): ReactNode;

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
	 * @param ofSelection
	 */
	ofSelection(ofSelection: IOfSelection<TItem, TOnChange>): void;

	icon?: ReactNode;
}>

export function DrawerSelect<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any>(
	{
		value,
		type = "single",
		onChange,
		onSelection,
		translation,
		defaultSelection,
		selectionProviderProps,
		render,
		renderList,
		withFulltext = true,
		toChange = type === "single" ? selection => toSingleSelection(selection) as TOnChange : selection => toMultiSelection(selection) as TOnChange,
		ofSelection,
		toPreview,
		icon,
		children,
	}: IDrawerSelectProps<TItem, TOnChange>) {
	const sourceContext = useSourceContext<TItem>();
	const visibleContext = useVisibleContext();
	const filterContext = useOptionalFilterContext();
	const blockContext = useOptionalBlockContext();

	const $toPreview = (selection?: ISelection<TItem>) => {
		const preview = toPreview(selection);
		return preview === undefined ? <Typography.Text type={"secondary"}><Translate {...translation} text={"placeholder"}/></Typography.Text> : preview;
	};

	return <SelectionProvider<TItem>
		type={type}
		defaultSelection={defaultSelection}
		onSelection={selection => {
			onSelection?.(selection);
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
							{renderList?.({
								sourceContext,
								selectionContext,
								filterContext,
								render,
							}) || <CheckList
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
							</CheckList>}
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
				{blockContext?.isBlocked() ? <Centered>
					<DotLoading/>
				</Centered> : <Space>
					{icon ? <Typography.Text type={"secondary"}>{icon}</Typography.Text> : null}
					{$toPreview(selectionContext.selection())}
				</Space>}
				{children}
			</>}
		</SelectionContext.Consumer>
	</SelectionProvider>;
}
