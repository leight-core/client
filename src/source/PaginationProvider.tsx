import {PaginationContext, useCursorContext, useSourceContext} from "@leight-core/client";
import {FC, PropsWithChildren} from "react";
import {useTranslation} from "react-i18next";

export type IPaginationProviderProps = PropsWithChildren;

export const PaginationProvider: FC<IPaginationProviderProps> = props => {
	const {t} = useTranslation();
	const sourceContext = useSourceContext();
	const cursorContext = useCursorContext();
	return <PaginationContext.Provider
		value={{
			pagination: () => ({
				responsive: true,
				current: cursorContext.page + 1,
				total: cursorContext.pages,
				pageSize: cursorContext.size,
				defaultPageSize: cursorContext.size,
				showSizeChanger: false,
				showQuickJumper: false,
				hideOnSinglePage: true,
				showTotal: (total, [from, to]) => t(`${sourceContext.name}.list.total`, {data: {total, from, to}}),
				onChange: (current, size) => cursorContext?.setPage(current - 1, size),
			}),
		}}
		{...props}
	/>;
};
