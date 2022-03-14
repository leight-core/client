import {isArray, isCallable, isString, merge, useSourceContext} from "@leight-core/client";
import {Empty, Table as CoolTable, TablePaginationConfig, TableProps} from "antd";
import {FilterValue, SorterResult} from "antd/lib/table/interface";
import React, {ReactNode} from "react";
import {useTranslation} from "react-i18next";
import {IndexOf, IQueryParams, IRecordItem, ISourceContext, ITableChildrenCallback, ITableToFilterCallback} from "@leight-core/api";

export interface ITableProps<TResponse, TFilter = void, TOrderBy = void, TQuery extends IQueryParams | void = void> extends Omit<TableProps<TResponse>, "footer"> {
	header?: (sourceContext: ISourceContext<TResponse, TFilter, TOrderBy, TQuery>) => ReactNode;
	footer?: (sourceContext: ISourceContext<TResponse, TFilter, TOrderBy, TQuery>) => ReactNode;
	children?: ITableChildrenCallback<TResponse, TFilter, TOrderBy, TQuery> | ReactNode;
	toFilter?: ITableToFilterCallback<TResponse, TFilter>;
}

export const Table = <TResponse extends object, TFilter = void, TOrderBy = void, TQuery extends IQueryParams | void = void>(
	{
		children,
		header,
		footer,
		toFilter = () => undefined,
		...props
	}: ITableProps<TResponse, TFilter, TOrderBy, TQuery>) => {
	const {t} = useTranslation();
	const sourceContext = useSourceContext<TResponse, TFilter, TOrderBy, TQuery>();
	if (header && !props.title) {
		props.title = () => header(sourceContext);
	}
	return <CoolTable<TResponse>
		style={{minHeight: "50vh"}}
		showSorterTooltip={false}
		dataSource={sourceContext.result.isSuccess ? sourceContext.result.data.items : []}
		rowKey={((record: IRecordItem) => record.id) as any}
		loading={{
			spinning: sourceContext.result.isLoading,
			delay: 50,
		}}
		size={"large"}
		locale={{emptyText: <Empty description={t("common.nothing-found")}/>}}
		pagination={{
			...sourceContext.pagination(),
			position: ['bottomRight'],
		}}
		onChange={((pagination: TablePaginationConfig, filters: Record<keyof TResponse, FilterValue | null>, sorter: SorterResult<TResponse> | SorterResult<TResponse>[]) => {
			const orderBy: IndexOf<any> = {};
			((isArray(sorter) ? sorter : [sorter]) as SorterResult<TResponse>[]).forEach(sorter => {
				orderBy[sorter.columnKey as string] = (sorter.column === undefined ? undefined : sorter.order === "ascend") as any;
			});
			sourceContext.setOrderBy(orderBy as TOrderBy);
			sourceContext.setFilter(merge<TFilter, TFilter>(sourceContext.filter || {}, toFilter({filters, current: sourceContext.filter}) || {}));
		}) as any}
		footer={() => footer?.(sourceContext)}
		{...props}
	>
		{isCallable(children) ? (children as ITableChildrenCallback<TResponse, TFilter, TOrderBy, TQuery>)({
			column: (props: any) => {
				if (isString(props.title)) {
					props.title = t(props.title as string);
				}
				return <CoolTable.Column {...props}/>;
			},
			sourceContext,
		}) : children}
	</CoolTable>;
};
