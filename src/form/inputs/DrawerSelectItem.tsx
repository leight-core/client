import {ISelection, ISelectionContext, IWithIdentity} from "@leight-core/api";
import {DrawerSelect, IDrawerSelectProps, IMobileFormItemProps, MobileFormItem, VisibleProvider} from "@leight-core/client";
import {ReactNode} from "react";

export type IDrawerSelectItemProps<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any> = Omit<IMobileFormItemProps, "children"> & {
	render(item: TItem): ReactNode;
	/**
	 * Default selection (shortcut to selectionProviderProps)
	 */
	defaultSelection?: Record<string, TItem>;
	selected?: TItem;
	drawerSelectProps?: Partial<IDrawerSelectProps<TItem, TOnChange>>;
	toChange?(selection: ISelection<TItem>): TOnChange | undefined;
	toPreview(selection?: ISelection<TItem>): ReactNode;
	ofSelection(value: TOnChange | undefined, selectionContext: ISelectionContext<TItem>): void;
	icon?: ReactNode;
};

export function DrawerSelectItem<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any>(
	{
		render,
		defaultSelection,
		selected,
		drawerSelectProps,
		field,
		toChange,
		toPreview,
		ofSelection,
		icon,
		...props
	}: IDrawerSelectItemProps<TItem, TOnChange>) {
	return <VisibleProvider>
		<MobileFormItem
			field={field}
			withVisible
			{...props}
		>
			<DrawerSelect
				render={render}
				defaultSelection={selected ? {[selected.id]: selected} : defaultSelection}
				toChange={toChange}
				toPreview={toPreview}
				ofSelection={ofSelection}
				icon={icon}
				{...drawerSelectProps}
			/>
		</MobileFormItem>
	</VisibleProvider>;
}
