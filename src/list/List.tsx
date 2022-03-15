import {ISourceContext} from "@leight-core/api";
import {List as CoolList, ListProps} from "antd";
import React, {PropsWithChildren, ReactNode} from "react";
import {useSourceContext} from "@leight-core/client";

export interface IListProps<TResponse> extends Partial<ListProps<TResponse>> {
	header?: (sourceContext: ISourceContext<TResponse>) => ReactNode;
	footer?: (sourceContext: ISourceContext<TResponse>) => ReactNode;
	children?: (item: TResponse) => ReactNode;
}

export const ListItem = CoolList.Item;
export const ListItemMeta = CoolList.Item.Meta;

export const List = <TResponse, >(
	{
		header,
		footer,
		children,
		...props
	}: PropsWithChildren<IListProps<TResponse>>) => {
	const sourceContext = useSourceContext<TResponse>();
	return <CoolList
		header={header?.(sourceContext)}
		footer={footer?.(sourceContext)}
		dataSource={sourceContext.data().items}
		loading={{
			spinning: sourceContext.result.isLoading,
			delay: 50,
		}}
		renderItem={children}
		pagination={sourceContext.pagination()}
		size={'large'}
		{...props}
	/>
}
