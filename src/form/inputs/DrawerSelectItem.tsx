import {IWithIdentity} from "@leight-core/api";
import {DrawerSelect, IDrawerSelectProps, IMobileFormItemProps, MobileFormItem} from "@leight-core/client";
import {Input} from "antd-mobile";
import {ReactNode} from "react";

export type IDrawerSelectItemProps<TItem extends Record<string, any> & IWithIdentity = any> = Omit<IMobileFormItemProps, "children"> & {
	render(item: TItem): ReactNode;
	drawerSelectProps?: Partial<IDrawerSelectProps<TItem>>;
};

export function DrawerSelectItem<TItem extends Record<string, any> & IWithIdentity = any>(
	{
		render,
		drawerSelectProps,
		...props
	}: IDrawerSelectItemProps<TItem>) {
	return <DrawerSelect
		render={render}
		{...drawerSelectProps}
	>
		<MobileFormItem
			withVisible
			{...props}
		>
			<Input readOnly/>
		</MobileFormItem>
	</DrawerSelect>;
}
