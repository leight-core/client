import {ICursorContext, ISourceContext, ITranslationProps} from "@leight-core/api";
import {Translate, useCursorContext, useSourceContext} from "@leight-core/client";
import {toPercent} from "@leight-core/utils";
import {Col, Row} from "antd";
import {DotLoading, ErrorBlock, ProgressCircle} from "antd-mobile";
import {ReactNode} from "react";

export interface IListLoaderRenderEmpty<TItem> {
	sourceContext: ISourceContext<TItem>;
	cursorContext: ICursorContext | null;
}

export interface IListLoaderRenderNothing<TItem> {
	sourceContext: ISourceContext<TItem>;
	cursorContext: ICursorContext | null;
}

export interface IListLoaderProps<TItem> {
	translation?: ITranslationProps;

	renderEmpty?(props: IListLoaderRenderEmpty<TItem>): ReactNode;

	renderNothing?(props: IListLoaderRenderNothing<TItem>): ReactNode;
}

export function ListLoader<TItem>(
	{
		translation,
		renderEmpty,
		renderNothing,
	}: IListLoaderProps<TItem>) {
	const sourceContext = useSourceContext<TItem>();
	const cursorContext = useCursorContext();
	return <>
		{cursorContext.page === undefined || cursorContext.pages === undefined ?
			<DotLoading/> : (cursorContext.pages > 0 ? <Row align={"top"} justify={"center"} gutter={4}>
				<Col span={"auto"}>{`${cursorContext.page}/${cursorContext.pages}`}</Col>
				{cursorContext.hasMore() && <Col span={2}><ProgressCircle
					percent={toPercent(cursorContext.page || 0, cursorContext.pages || 0)}
					style={{"--size": "18px", "--track-width": "2px"}}
				/></Col>}
			</Row> : renderEmpty?.({
				sourceContext,
				cursorContext,
			}) || <ErrorBlock
				status={"empty"}
				title={<Translate {...translation} text={cursorContext.total ? "empty.title" : "empty.nothing.title"}/>}
				description={<Translate {...translation} text={cursorContext.total ? "empty.title" : "empty.nothing.description"}/>}
			>
				{renderNothing?.({
					sourceContext,
					cursorContext,
				})}
			</ErrorBlock>)}
	</>;
}
