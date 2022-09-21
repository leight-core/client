import {useFilterContext, useOptionalCursorContext, useSourceContext} from "@leight-core/client";
import {SearchBar} from "antd-mobile";
import {ComponentProps, FC} from "react";

export interface IFulltextBarProps extends Partial<ComponentProps<typeof SearchBar>> {
}

export const FulltextBar: FC<IFulltextBarProps> = props => {
	const sourceContext = useSourceContext();
	const filterContext = useFilterContext();
	const cursorContext = useOptionalCursorContext();
	return <SearchBar
		onSearch={value => {
			sourceContext.reset();
			filterContext.setFilter({fulltext: value});
			setTimeout(() => cursorContext?.setPage(0), 0);
		}}
		onClear={() => {
			sourceContext.reset();
			filterContext.setFilter();
			setTimeout(() => cursorContext?.setPage(0), 0);
		}}
		{...props}
	/>;
};