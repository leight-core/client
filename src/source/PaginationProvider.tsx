import {PaginationContext, useOptionalCursorContext, useSourceContext} from "@leight-core/client";
import {FC, PropsWithChildren} from "react";
import {useTranslation} from "react-i18next";

export type IPaginationProviderProps = PropsWithChildren;

export const PaginationProvider: FC<IPaginationProviderProps> = props => {
	const {t} = useTranslation();
	const sourceContext = useSourceContext();
	const cursorContext = useOptionalCursorContext();
	return <PaginationContext.Provider
		value={{
			pagination: () => cursorContext && sourceContext?.count?.isSuccess ? {
				responsive: true,
				current: cursorContext.page + 1,
				total: sourceContext.count.data,
				pageSize: cursorContext.size,
				defaultPageSize: cursorContext.size,
				showSizeChanger: false,
				showQuickJumper: false,
				hideOnSinglePage: true,
				showTotal: (total, [from, to]) => t(`${sourceContext.name}.list.total`, {data: {total, from, to}}),
				onChange: (current, size) => cursorContext?.setPage(current - 1, size),
			} : undefined,
		}}
		{...props}
	/>;
};
