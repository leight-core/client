import {CursorContext} from "@leight-core/client";
import {FC, PropsWithChildren, useEffect, useState} from "react";

export type ICursorProviderProps = PropsWithChildren<{
	name: string;
	defaultPage?: number;
	defaultSize?: number;
}>;

export const CursorProvider: FC<ICursorProviderProps> = (
	{
		name,
		defaultPage = 0,
		defaultSize = 10,
		...props
	}) => {
	const [[page, size], setPage] = useState<[number, number]>([defaultPage, defaultSize]);
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
			size,
			append,
			prepend,
			setPage: (page, size = defaultSize) => setPage([page, size]),
			next: append => {
				setAppend(append);
				setPage([page + 1, size]);
			},
			prev: prepend => {
				setPrepend(prepend);
				setPage([Math.max(0, page - 1), size]);
			},
		}}
		{...props}
	/>;
};
