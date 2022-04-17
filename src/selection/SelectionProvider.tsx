import {ISelectionType} from "@leight-core/api";
import {SelectionContext} from "@leight-core/client";
import {PropsWithChildren, useEffect, useState} from "react";

export interface ISelectionProviderProps<TSelection = any> {
	/**
	 * Selection type.
	 */
	type?: ISelectionType;
	/**
	 * Default pre-set selection; could be overridden by a user. Apply selection prop takes precedence.
	 */
	defaultSelection?: { [index in string]: TSelection };
	/**
	 * Apply the given selection all the times (regardless of values set by a user)
	 */
	applySelection?: { [index in string]: TSelection };
}

export function SelectionProvider<TSelection, >({type = "none", defaultSelection, applySelection, ...props}: PropsWithChildren<ISelectionProviderProps<TSelection>>) {
	const [selection, setSelection] = useState<{ [index in string]: TSelection | undefined }>(applySelection || defaultSelection || {});
	useEffect(() => {
		setSelection(defaultSelection || {});
	}, [defaultSelection]);
	useEffect(() => {
		setSelection(applySelection || {});
	}, [applySelection]);
	return <SelectionContext.Provider
		value={{
			isSelected: id => !!selection[id],
			asSelection: () => selection,
			toSelection: () => Object.keys(selection).filter(key => !!selection[key]),
			onSelect: (id, selection) => {
				setSelection(prev => {
					switch (type) {
						case "none":
							return {};
						case "single":
							return {[id]: !prev[id] ? selection : undefined};
						case "multi":
							return {...prev, [id]: !prev[id] ? selection : undefined};
					}
					return {};
				});
			},
		}}
		{...props}
	/>;
}
