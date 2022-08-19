import {useCursorContext, useFilterContext} from "@leight-core/client";
import {Button, ButtonProps} from "antd";
import {useTranslation} from "react-i18next";

export interface IFilterButtonProps<TFilter> extends Partial<ButtonProps> {
	label: string;
	applyFilter?: TFilter;
}

export const FilterButton = <TFilter, >({label, applyFilter, ...props}: IFilterButtonProps<TFilter>) => {
	const {t} = useTranslation();
	const cursorContext = useCursorContext();
	const filterContext = useFilterContext();
	return <Button
		type={"link"}
		size={"small"}
		onClick={() => {
			filterContext.setFilter(applyFilter);
			cursorContext.setPage(0);
		}}
		{...props}
	>
		{t(label)}
	</Button>;
};
