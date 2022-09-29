import {ICursorContext, IFilterContext, INavigate, ISourceContext, ITranslationProps} from "@leight-core/api";
import {FulltextBar, Translate, useNavigate, useOptionalCursorContext, useOptionalFilterContext, useSourceContext} from "@leight-core/client";
import {toPercent} from "@leight-core/utils";
import {Col, Row} from "antd";
import {DotLoading, ErrorBlock, InfiniteScroll, List, ProgressCircle} from "antd-mobile";
import {ComponentProps, FC, ReactNode} from "react";

export interface IInfiniteListHeaderRequest<TResponse> {
	sourceContext: ISourceContext<TResponse>;
	filterContext?: IFilterContext | null;
}

export interface IInfiniteListSelectRenderLoading<TResponse> {
	sourceContext: ISourceContext<TResponse>;
	cursorContext: ICursorContext | null;
}

export interface IInfiniteListSelectRenderEmpty<TResponse> {
	sourceContext: ISourceContext<TResponse>;
	cursorContext: ICursorContext | null;
}

export interface IInfiniteListProps<TResponse> extends Partial<Omit<ComponentProps<typeof List>, "children" | "header">> {
	translation?: ITranslationProps;

	children?(item: TResponse): ReactNode;

	header?(request: IInfiniteListHeaderRequest<TResponse>): ReactNode;

	withFulltext?: boolean;

	/**
	 * Override loading state indicator including no more data/empty list.
	 *
	 * @param props
	 */
	renderLoading?(props: IInfiniteListSelectRenderLoading<TResponse>): ReactNode;

	renderEmpty?(props: IInfiniteListSelectRenderEmpty<TResponse>): ReactNode;
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
		translation,
		withFulltext = false,
		renderLoading,
		renderEmpty,
		header,
		...props
	}: IInfiniteListProps<TResponse>) => {
	const sourceContext = useSourceContext<TResponse>();
	const cursorContext = useOptionalCursorContext();
	const filterContext = useOptionalFilterContext();
	if (withFulltext && header) {
		console.warn(`Using infinite list ${sourceContext.name} with fulltext and header specified; please use flags only or just header.`);
	}
	return <>
		<List
			header={withFulltext ? <FulltextBar/> : header?.({sourceContext, filterContext})}
			{...props}
		>
			{sourceContext.data().map(item => children?.(item))}
		</List>
		<InfiniteScroll
			loadMore={async () => sourceContext.more(true)}
			hasMore={sourceContext.hasMore()}
		>
			{renderLoading?.({
				sourceContext,
				cursorContext,
			}) || (cursorContext?.page === undefined || cursorContext?.pages === undefined ?
				<DotLoading/> : (cursorContext.pages > 0 ? <Row align={"top"} justify={"center"} gutter={4}>
					<Col span={"auto"}>{`${cursorContext?.page}/${cursorContext?.pages}`}</Col>
					{cursorContext.page !== cursorContext.pages && <Col span={2}><ProgressCircle
						percent={toPercent(cursorContext?.page || 0, cursorContext?.pages || 0)}
						style={{"--size": "18px", "--track-width": "2px"}}
					/></Col>}
				</Row> : renderEmpty?.({
					sourceContext,
					cursorContext,
				}) || <ErrorBlock
					status={"empty"}
					title={<Translate {...translation} text={"empty.title"}/>}
					description={<Translate {...translation} text={"empty.description"}/>}
				/>))}
		</InfiniteScroll>
	</>;
};
