import {ISelection, IWithIdentity} from "@leight-core/api";
import {DrawerSelect, IDrawerSelectProps, IMobileFormItemProps, MobileFormItem, VisibleProvider} from "@leight-core/client";
import {ReactNode} from "react";

export type IDrawerSelectItemProps<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any> = Omit<IMobileFormItemProps, "children"> & {
	render(item: TItem): ReactNode;
	/**
	 * Default selection (shortcut to selectionProviderProps)
	 */
	defaultSelection?: Record<string, TItem>;
	drawerSelectProps?: Partial<IDrawerSelectProps<TItem, TOnChange>>;
	toChange?(selection: ISelection<TItem>): TOnChange | undefined;
	toPreview?(selection?: ISelection<TItem>): ReactNode;
};

export function DrawerSelectItem<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any>(
	{
		render,
		defaultSelection,
		drawerSelectProps,
		field,
		toChange,
		toPreview,
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
				defaultSelection={defaultSelection}
				toChange={toChange}
				toPreview={toPreview}
				{...drawerSelectProps}
			/>
		</MobileFormItem>
	</VisibleProvider>;
}
