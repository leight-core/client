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
	/**
	 * Default selection handler.
	 * @param event
	 */
	onSelection?(event: ISelection<TSelection>): void;
}>;

export function SelectionProvider<TSelection, >({type = "single", defaultEnabled = type !== "none", defaultSelection, applySelection, onSelection, ...props}: ISelectionProviderProps<TSelection>) {
	const [enabled, setEnabled] = useState(defaultEnabled && type !== "none");
	const [selection, setSelection] = useState<Record<string, TSelection | undefined>>(applySelection || defaultSelection || {});
	const onSelectionEvents = useRef<((event: ISelection<TSelection>) => void)[]>(onSelection ? [onSelection] : []);

	useEffect(() => {
		setSelection(defaultSelection || {});
	}, [defaultSelection]);
	useEffect(() => {
		setSelection(applySelection || defaultSelection || {});
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
	const deSelect: ISelectionContext<TSelection>["deSelect"] = id => {
		const $selection = {...selection};
		delete $selection[id];
		setSelection($selection);
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
	const $selection = () => ({
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
			deSelect,
			item: item => select(item.id, item),
			items: items => items.map(item => select(item.id, item)),
			deItem: item => deSelect(item.id),
			isSelectedItem: item => isSelected(item.id),
			isEmpty,
			toSingle,
			onSelection: callback => onSelectionEvents.current.push(callback),
			selection: $selection,
			toSingleItem: () => selection[toSingle()],
			handleSelection: () => {
				const selection = $selection();
				onSelectionEvents.current.map(callback => callback(selection));
			},
			clear: () => setSelection({}),
		}}
		{...props}
	/>;
}
