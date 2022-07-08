import {IFilterContext, INavigate, ISourceContext} from "@leight-core/api";
import {useNavigate, useOptionalFilterContext, useSourceContext} from "@leight-core/client";
import {Divider, DotLoading, InfiniteScroll, List, SearchBar, Space} from "antd-mobile";
import {ComponentProps, FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface IInfiniteListHeaderRequest<TResponse> {
	sourceContext: ISourceContext<TResponse>;
	filterContext?: IFilterContext | null;
}

export interface IInfiniteListProps<TResponse> extends Partial<Omit<ComponentProps<typeof List>, "children" | "header">> {
	children?(item: TResponse): ReactNode;

	header?(request: IInfiniteListHeaderRequest<TResponse>): ReactNode;

	withFulltext?: boolean;
}

export interface IInfiniteListItemProps extends Omit<ComponentProps<typeof List["Item"]>, "onClick"> {
	onClick?(navigate: INavigate): void;
}

export const InfiniteListItem: FC<IInfiniteListItemProps> = ({onClick, clickable, ...props}) => {
	const navigate = useNavigate();
	return <List.Item
		clickable={clickable}
		onClick={onClick && clickable ? () => onClick(navigate) : undefined}
		{...props}
	/>;
};

export const InfiniteList = <TResponse, >(
	{
		children,
		withFulltext = false,
		header,
		...props
	}: IInfiniteListProps<TResponse>) => {
	const {t} = useTranslation();
	const sourceContext = useSourceContext<TResponse>();
	const filterContext = useOptionalFilterContext();
	if (withFulltext && header) {
		console.warn(`Using infinite list ${sourceContext.name} with fulltext and header specified; please use flags only or just header.`);
	}
	if (withFulltext && !filterContext) {
		console.warn(`Using infinite list ${sourceContext.name} with fulltext and without filter context!`);
	}
	return <>
		<List
			header={withFulltext ? <SearchBar
				onSearch={value => {
					sourceContext.reset();
					filterContext?.setFilter({fulltext: value});
				}}
				onClear={() => {
					sourceContext.reset();
					filterContext?.setFilter();
				}}
			/> : header?.({sourceContext, filterContext})}
			{...props}
		>
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
				<Divider
					style={{width: "100%"}}
				>
					{t("common.infinite.no-more")}
				</Divider>
			)}
		</InfiniteScroll>
	</>;
};
