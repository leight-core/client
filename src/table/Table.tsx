import {ISourceContext, ISourceItem, ITableChildrenCallback} from "@leight-core/api";
import {LoaderIcon, PaginationContext, PaginationProvider, Template, useSourceContext} from "@leight-core/client";
import {isCallable, isString} from "@leight-core/utils";
import {UseQueryResult} from "@tanstack/react-query";
import {Empty, SpinProps, Table as CoolTable, TableProps} from "antd";
import React, {ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface ITableProps<TSourceContext extends ISourceContext<any>> extends Omit<TableProps<ISourceItem<TSourceContext>>, "header" | "footer" | "children"> {
	header?: (sourceContext: TSourceContext) => ReactNode;
	footer?: (sourceContext: TSourceContext) => ReactNode;
	children?: ITableChildrenCallback<TSourceContext> | ReactNode;
	loading?: Partial<SpinProps>;
	withLoading?: keyof Pick<UseQueryResult, "isLoading" | "isFetching" | "isRefetching">;
}

export const Table = <TSourceContext extends ISourceContext<any>>(
	{
		children,
		header,
		footer,
		loading,
		withLoading = "isFetching",
		...props
	}: ITableProps<TSourceContext>) => {
	const {t} = useTranslation();
	const sourceContext = useSourceContext() as TSourceContext;
	if (header && !props.title) {
		props.title = () => header(sourceContext);
	}
	return <PaginationProvider>
		<PaginationContext.Consumer>
			{paginationContext =>
				<CoolTable<ISourceItem<TSourceContext>>
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
					footer={() => footer?.(sourceContext)}
					{...props}
				>
					{isCallable(children) ? (children as ITableChildrenCallback<TSourceContext>)({
						column: (props: any) => {
							if (isString(props.title)) {
								props.title = t(props.title as string);
							}
							return <CoolTable.Column {...props}/>;
						},
						sourceContext,
					}) : children as any}
				</CoolTable>}
		</PaginationContext.Consumer>
	</PaginationProvider>;
};
