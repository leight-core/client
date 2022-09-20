import {ISelection, IWithIdentity} from "@leight-core/api";
import {DrawerSelect, IDrawerSelectProps, IMobileFormItemProps, MobileFormItem, useFormContext, useOptionalItemGroupContext} from "@leight-core/client";
import {Input} from "antd-mobile";
import {ReactNode} from "react";

export const DrawerSelectSingle = ({single}: ISelection<IWithIdentity>) => single?.id;

export const DrawerSelectMulti = ({selected}: ISelection<IWithIdentity>) => selected;

export type IDrawerSelectItemProps<TItem extends Record<string, any> & IWithIdentity = any> = Omit<IMobileFormItemProps, "children"> & {
	render(item: TItem): ReactNode;
	/**
	 * Default selection (shortcut to selectionProviderProps)
	 */
	defaultSelection?: Record<string, TItem>;
	drawerSelectProps?: Partial<IDrawerSelectProps<TItem>>;
	toValue?(event: ISelection<TItem>): any;
};

export function DrawerSelectItem<TItem extends Record<string, any> & IWithIdentity = any>(
	{
		render,
		defaultSelection,
		drawerSelectProps,
		field,
		toValue = DrawerSelectSingle,
		...props
	}: IDrawerSelectItemProps<TItem>) {
	const formContext = useFormContext();
	const itemGroupContext = useOptionalItemGroupContext();
	field = ([] as (string | number)[]).concat(itemGroupContext?.prefix || [], Array.isArray(field) ? field : [field]);
	return <DrawerSelect
		render={render}
		defaultSelection={defaultSelection}
		onSelection={event => {
			formContext.setValue([{
				name: field,
				value: toValue(event),
			}]);
		}}
		{...drawerSelectProps}
	>
		<MobileFormItem
			field={field}
			withVisible
			{...props}
		>
			<Input readOnly/>
		</MobileFormItem>
	</DrawerSelect>;
}
