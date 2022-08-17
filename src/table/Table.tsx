import {LoaderIcon, PaginationContext, PaginationProvider, Template, useSourceContext} from "@leight-core/client";
import {isCallable, isString} from "@leight-core/utils";
import {UseQueryResult} from "@tanstack/react-query";
import {Empty, SpinProps, Table as CoolTable, TableProps} from "antd";
import type {ColumnProps} from "antd/es/table";
import React, {ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface ITableColumnProps<TItem> extends Omit<ColumnProps<TItem>, "dataIndex"> {
	readonly dataIndex?: keyof TItem;
}

export interface IITableChildren<TResponse> {
	column(props: ITableColumnProps<TResponse>): ReactNode;
}

export interface ITableChildrenCallback<TResponse> {
	(children: IITableChildren<TResponse>): ReactNode;
}


export interface ITableProps<TResponse> extends Omit<TableProps<TResponse>, "children"> {
	children?: ITableChildrenCallback<TResponse> | ReactNode;
	loading?: Partial<SpinProps>;
	withLoading?: keyof Pick<UseQueryResult, "isLoading" | "isFetching" | "isRefetching">;
}

export const Table = <TResponse, >(
	{
		children,
		loading,
		withLoading = "isFetching",
		...props
	}: ITableProps<TResponse>) => {
	const {t} = useTranslation();
	const sourceContext = useSourceContext<TResponse>();
	return <PaginationProvider>
		<PaginationContext.Consumer>
			{paginationContext =>
				<CoolTable<any>
					style={{minHeight: "50vh"}}
					showSorterTooltip={false}
					dataSource={sourceContext.data()}
					rowKey={((record: any) => record.id) as any}
					loading={{
						spinning: sourceContext.result[withLoading],
						delay: 250,
						indicator: <Template
							icon={<LoaderIcon/>}
						/>,
						...loading,
					}}
					size={"large"}
					locale={{emptyText: <Empty description={t("common.nothing-found")}/>}}
					pagination={{
						...paginationContext.pagination(),
						position: ["bottomRight"],
					}}
					{...props}
				>
					{isCallable(children) ? (children as ITableChildrenCallback<any>)({
						column: (props: any) => {
							if (isString(props.title)) {
								props.title = t(props.title as string);
							}
							return <CoolTable.Column {...props}/>;
						},
					}) : children as any}
				</CoolTable>}
		</PaginationContext.Consumer>
	</PaginationProvider>;
};
