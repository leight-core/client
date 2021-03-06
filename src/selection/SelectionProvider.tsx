import {ISelection, ISelectionContext, ISelectionType} from "@leight-core/api";
import {SelectionContext} from "@leight-core/client";
import {PropsWithChildren, useEffect, useRef, useState} from "react";

export type ISelectionProviderProps<TSelection = any> = PropsWithChildren<{
	/**
	 * Selection type.
	 */
	type?: ISelectionType;
	defaultEnabled?: boolean;
	/**
	 * Default pre-set selection; could be overridden by a user. Apply selection prop takes precedence.
	 */
	defaultSelection?: Record<string, TSelection>;
	/**
	 * Apply the given selection all the times (regardless of values set by a user)
	 */
	applySelection?: Record<string, TSelection>;
}>;

export function SelectionProvider<TSelection, >({type = "none", defaultEnabled = type !== "none", defaultSelection, applySelection, ...props}: ISelectionProviderProps<TSelection>) {
	const [enabled, setEnabled] = useState(defaultEnabled && type !== "none");
	const [selection, setSelection] = useState<Record<string, TSelection | undefined>>(applySelection || defaultSelection || {});
	const onSelectionEvents = useRef<((event: ISelection<TSelection>) => void)[]>([]);

	useEffect(() => {
		setSelection(defaultSelection || {});
	}, [defaultSelection]);
	useEffect(() => {
		setSelection(applySelection || {});
	}, [applySelection]);

	const select: ISelectionContext<TSelection>["select"] = (id, selection) => {
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
	const isSelected: ISelectionContext<TSelection>["isSelected"] = id => !!selection[id];
	const toSelection: ISelectionContext<TSelection>["toSelection"] = () => Object.keys(selection).filter(key => !!selection[key]);
	const isEmpty: ISelectionContext<TSelection>["isEmpty"] = () => !toSelection().length;
	const toSingle: ISelectionContext<TSelection>["toSingle"] = () => {
		if (isEmpty()) {
			throw new Error("Selection is empty!");
		}
		return toSelection()[0];
	};
	const _selection = () => ({
		isEmpty: isEmpty(),
		single: (() => {
			try {
				return selection[toSingle()];
			} catch (e) {
				// swallow "Selection Empty" error
			}
		})(),
		selected: toSelection(),
		items: toSelection().reduce((prev, current) => ({...prev, [current]: selection[current]}), {}),
	});

	return <SelectionContext.Provider
		value={{
			enable: (enable = true) => {
				setSelection({});
				setEnabled(enable);
			},
			isEnabled: () => enabled,
			isSelected,
			asSelection: () => selection,
			toSelection,
			toItems: () => Object.values(selection).filter(item => !!item),
			select,
			item: item => select(item.id, item),
			isSelectedItem: item => isSelected(item.id),
			isEmpty,
			toSingle,
			onSelection: callback => onSelectionEvents.current.push(callback),
			selection: _selection,
			toSingleItem: () => selection[toSingle()],
			handleSelection: () => {
				const selection = _selection();
				onSelectionEvents.current.map(callback => callback(selection));
			},
			clear: () => setSelection({}),
		}}
		{...props}
	/>;
}
