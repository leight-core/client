import {CursorContext} from "@leight-core/client";
import {FC, useEffect, useState} from "react";

export interface ICursorProviderProps {
	defaultPage?: number;
	defaultSize?: number;
}

export const CursorProvider: FC<ICursorProviderProps> = ({defaultPage, defaultSize, ...props}) => {
	const [page, setPage] = useState<number | undefined>(defaultPage);
	const [size, setSize] = useState<number | undefined>(defaultSize);
	useEffect(() => {
		setPage(defaultPage);
	}, [defaultPage]);
	useEffect(() => {
		setPage(defaultSize);
	}, [defaultSize]);
	return <CursorContext.Provider
		value={{
			page,
			size,
			setPage(page?: number, size?: number) {
				setPage(page);
				/**
				 * We must have a page to set the size.
				 */
				setSize(page && size);
			}
		}}
		{...props}
	/>;
}
