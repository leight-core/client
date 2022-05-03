import {CursorContext} from "@leight-core/client";
import {FC, PropsWithChildren, useEffect, useState} from "react";

export type ICursorProviderProps = PropsWithChildren<{
	name: string;
	defaultPage?: number;
	defaultSize?: number;
}>;

export const CursorProvider: FC<ICursorProviderProps> = ({name, defaultPage, defaultSize, ...props}) => {
	const [[page, size], setPage] = useState<[number | undefined, number | undefined]>([defaultPage, defaultSize]);
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
			setPage: (page?: number, size: number | undefined = defaultSize) => setPage([page, size]),
		}}
		{...props}
	/>;
};
