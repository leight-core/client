import Icon from "@ant-design/icons";
import {IFilterContext, INavigate, ISourceContext} from "@leight-core/api";
import {useNavigate, useOptionalFilterContext, useSourceContext} from "@leight-core/client";
import {DotLoading, InfiniteScroll, List, SearchBar, Space} from "antd-mobile";
import {ComponentProps, FC, ReactNode} from "react";
import {IoTrailSignOutline} from "react-icons/io5";

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
		onClick={onClick && clickable !== false ? () => onClick(navigate) : undefined}
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
			<Space>
				{sourceContext.result.isFetching || sourceContext.hasMore() ? (
					<DotLoading/>
				) : (
					<Icon component={IoTrailSignOutline} size={128}/>
				)}
			</Space>
		</InfiniteScroll>
	</>;
};
