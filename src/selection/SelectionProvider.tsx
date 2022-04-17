import {ISelectionContext, ISelectionType} from "@leight-core/api";
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

	const onSelect: ISelectionContext<any>["onSelect"] = (id, selection) => {
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
	};
	const isSelected: ISelectionContext<any>["isSelected"] = id => !!selection[id];
	const toSelection: ISelectionContext<any>["toSelection"] = () => Object.keys(selection).filter(key => !!selection[key]);
	const isEmpty: ISelectionContext<any>["isEmpty"] = () => toSelection().length === 0;

	return <SelectionContext.Provider
		value={{
			isSelected,
			asSelection: () => selection,
			toSelection,
			onSelect,
			onSelectItem: item => onSelect(item.id, item),
			isSelectedItem: item => isSelected(item.id),
			isEmpty,
			toSingle: () => {
				if (isEmpty()) {
					throw new Error("Selection is empty!");
				}
				return selection[toSelection()[0]];
			}
		}}
		{...props}
	/>;
}
