import {ICursorContext} from "@leight-core/api";
import {CursorContext} from "@leight-core/client";
import {isCallable} from "@leight-core/utils";
import {FC, ReactNode, useEffect, useState} from "react";

export interface ICursorProviderProps {
	name: string;
	defaultPage?: number;
	defaultSize?: number;
	children?: ReactNode | ((cursorContext: ICursorContext) => ReactNode);
}

export const CursorProvider: FC<ICursorProviderProps> = (
	{
		name,
		defaultPage = 0,
		defaultSize = 10,
		children,
	}) => {
	const [[page, size], setPage] = useState<[number, number]>([defaultPage, defaultSize]);
	const [pages, setPages] = useState<number>();
	const [append, setAppend] = useState<boolean>();
	const [prepend, setPrepend] = useState<boolean>();
	useEffect(() => {
		setPage([defaultPage, size]);
	}, [defaultPage]);
	useEffect(() => {
		setPage([page, defaultSize]);
	}, [defaultSize]);
	return <CursorContext.Provider
		value={{
			name,
			page,
			pages,
			size,
			append,
			prepend,
			setPage: (page, size = defaultSize) => setPage([page, size]),
			setPages,
			next: append => {
				setAppend(append);
				setPage([page + 1, size]);
			},
			prev: prepend => {
				setPrepend(prepend);
				setPage([Math.max(0, page - 1), size]);
			},
		}}
	>
		{isCallable(children) ? <CursorContext.Consumer>{children as any}</CursorContext.Consumer> : children as ReactNode}
	</CursorContext.Provider>;
};
