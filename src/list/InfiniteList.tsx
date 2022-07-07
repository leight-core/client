import {useSourceContext} from "@leight-core/client";
import {Divider, DotLoading, InfiniteScroll, List, Space} from "antd-mobile";
import {ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface IInfiniteListProps<TResponse> {
	children?(item: TResponse): ReactNode;
}

export const InfiniteListItem = List.Item;

export const InfiniteList = <TResponse, >({children}: IInfiniteListProps<TResponse>) => {
	const {t} = useTranslation();
	const sourceContext = useSourceContext<TResponse>();
	return <>
		<List>
			{sourceContext.data().map(item => children?.(item))}
		</List>
		<InfiniteScroll
			loadMore={async () => sourceContext.more(true)}
			hasMore={sourceContext.hasMore()}
		>
			{sourceContext.result.isFetching || sourceContext.hasMore() ? (
				<Space>
					<span>{t("common.infinite.loading")}</span>
					<DotLoading/>
				</Space>
			) : (
				<Divider style={{width: "100%"}}>{t("common.infinite.no-more")}</Divider>
			)}
		</InfiniteScroll>
	</>;
};
