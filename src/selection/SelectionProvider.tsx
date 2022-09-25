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

export function SelectionProvider<TSelection, >({type = "single", defaultEnabled = true, defaultSelection, applySelection, onSelection, ...props}: ISelectionProviderProps<TSelection>) {
	const [enabled, setEnabled] = useState(defaultEnabled);
	const [selection, setSelection] = useState<Record<string, TSelection | undefined>>({...defaultSelection, ...applySelection});
	const onSelectionEvents = useRef<((event: ISelection<TSelection>) => void)[]>(onSelection ? [onSelection] : []);

	useEffect(() => {
		setSelection({...defaultSelection, ...applySelection});
	}, [JSON.stringify(defaultSelection)]);
	useEffect(() => {
		setSelection({...defaultSelection, ...applySelection});
	}, [JSON.stringify(applySelection)]);

	const select: ISelectionContext<TSelection>["select"] = (id, $selection, select) => {
		setSelection(prev => {
			console.log("SelectionProvider: Current selection", selection);
			const $select = select === undefined ? !prev[id] : select;
			console.log("SelectionProvider: Selecting", type, "$select", $select, "item", $select ? {[id]: $selection} : {});
			if (type === "single") {
				return $select ? {[id]: $selection} : {};
			}
			console.log("SelectionProvider: Multi", {...prev, [id]: $select ? $selection : undefined});
			return {...prev, [id]: $select ? $selection : undefined};
		});
		setTimeout(() => {
			console.log("SelectionProvider: Selection timeout; selection", selection);
		}, 100);
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
	const $selection = () => {
		const items = toSelection().reduce((prev, current) => ({...prev, [current]: selection[current]}), {});
		return {
			isEmpty: isEmpty(),
			single: (() => {
				try {
					return selection[toSingle()];
				} catch (e) {
					// swallow "Selection Empty" error
				}
			})(),
			selected: toSelection(),
			selection: Object.values(items) as TSelection[],
			items,
		};
	};

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
			item: (item, $select) => select(item.id, item, $select),
			items: (items, $select) => items.map(item => select(item.id, item, $select)),
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
			clear: () => {
				console.log("Calling clear??");
				setSelection({});
			},
		}}
		{...props}
	/>;
}
