import {IQueryParams, ISourceContext} from "@leight-core/api";
import {List as CoolList, ListProps} from "antd";
import React, {PropsWithChildren, ReactNode} from "react";
import {useSourceContext} from "@leight-core/client";

export interface IListProps<TResponse extends object, TFilter = void, TOrderBy = void, TQuery extends IQueryParams | void = void> extends Partial<ListProps<TResponse>> {
	header?: (sourceContext: ISourceContext<TResponse, TFilter, TOrderBy, TQuery>) => ReactNode;
	footer?: (sourceContext: ISourceContext<TResponse, TFilter, TOrderBy, TQuery>) => ReactNode;
	children?: (item: TResponse) => ReactNode;
}

export const ListItem = CoolList.Item;
export const ListItemMeta = CoolList.Item.Meta;

export const List = <TResponse extends object, TFilter = void, TOrderBy = void, TQuery extends IQueryParams | void = void>(
	{
		header,
		footer,
		children,
		...props
	}: PropsWithChildren<IListProps<TResponse, TFilter, TOrderBy, TQuery>>) => {
	const sourceContext = useSourceContext<TResponse, TFilter, TOrderBy, TQuery>();
	return <CoolList
		header={() => header?.(sourceContext)}
		footer={() => footer?.(sourceContext)}
		dataSource={sourceContext.data().items}
		loading={{
			spinning: sourceContext.result.isLoading,
			delay: 50,
		}}
		renderItem={children}
		pagination={sourceContext.pagination()}
		{...props}
	/>
}
