import {IMobileFormContext, ISelection, ISelectionType, IVisibleContext, IWithIdentity} from "@leight-core/api";
import {Drawer, DrawerSelect, IDrawerProps, IDrawerSelectProps, IMobileFormItemProps, IOfSelection, MobileFormItem, useMobileFormContext, useOptionalBlockContext, VisibleContext, VisibleProvider} from "@leight-core/client";
import {SwipeAction} from "antd-mobile";
import {AddOutline} from "antd-mobile-icons";
import {ComponentProps, PropsWithChildren, ReactNode} from "react";

export interface ICreateWithProps<TValues extends Record<string, any> = any> {
	formContext: IMobileFormContext<TValues>;
	visibleContext: IVisibleContext;
}

export type IDrawerSelectItemProps<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any> = PropsWithChildren<Omit<IMobileFormItemProps, "children"> & {
	render(item: TItem): ReactNode;
	type?: ISelectionType;
	/**
	 * Default selection (shortcut to selectionProviderProps)
	 */
	defaultSelection?: Record<string, TItem>;
	selected?: TItem;
	drawerSelectProps?: Partial<IDrawerSelectProps<TItem, TOnChange>>;
	toChange?(selection: ISelection<TItem>): TOnChange | undefined;
	toPreview(selection?: ISelection<TItem>): ReactNode;
	ofSelection(ofSelection: IOfSelection<TItem, TOnChange>): void;
	icon?: ReactNode;
	createWith?(createWithProps: ICreateWithProps): ReactNode;
	createWithDrawer?: IDrawerProps;
	onSelection?(selection: ISelection<TItem>): void;
}>;

export function DrawerSelectItem<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any>(
	{
		render,
		type = "single",
		defaultSelection,
		selected,
		drawerSelectProps,
		field,
		toChange,
		toPreview,
		ofSelection,
		icon,
		createWith,
		createWithDrawer,
		onSelection,
		children,
		...props
	}: IDrawerSelectItemProps<TItem, TOnChange>) {
	const formContext = useMobileFormContext();
	const blockContext = useOptionalBlockContext();

	return <VisibleProvider>
		<VisibleContext.Consumer>
			{visibleContext => {
				const rightActions: ComponentProps<typeof SwipeAction>["rightActions"] = [];
				createWith && rightActions.push({key: JSON.stringify(field) + ".create", color: "primary", text: <AddOutline fontSize={24}/>, onClick: () => visibleContext.show()});
				return <>
					<SwipeAction
						rightActions={rightActions}
					>
						<VisibleProvider>
							<MobileFormItem
								field={field}
								withVisible
								disabled={blockContext?.isBlocked()}
								{...props}
							>
								<DrawerSelect
									render={render}
									type={type}
									defaultSelection={selected ? {[selected.id]: selected} : defaultSelection}
									toChange={toChange}
									toPreview={toPreview}
									ofSelection={ofSelection}
									icon={icon}
									onSelection={onSelection}
									children={children}
									{...drawerSelectProps}
								/>
							</MobileFormItem>
						</VisibleProvider>
					</SwipeAction>
					<Drawer
						bodyStyle={{padding: 0}}
						{...createWithDrawer}
					>
						{createWith?.({
							formContext,
							visibleContext,
						})}
					</Drawer>
				</>;
			}}
		</VisibleContext.Consumer>
	</VisibleProvider>;
}
