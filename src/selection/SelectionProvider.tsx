import {ISelection, ISelectionContext, ISelectionType} from "@leight-core/api";
import {SelectionContext} from "@leight-core/client";
import {PropsWithChildren, useEffect, useRef} from "react";

export type ISelectionProviderProps<TSelection = any> = PropsWithChildren<{
	/**
	 * Selection type.
	 */
	type?: ISelectionType;
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
	 * @param selection
	 */
	onSelection?(selection: ISelection<TSelection>): void;
}>;

export function SelectionProvider<TSelection, >({type = "single", defaultSelection, applySelection, onSelection, ...props}: ISelectionProviderProps<TSelection>) {
	const onSelectionEvents = useRef<((event: ISelection<TSelection>) => void)[]>(onSelection ? [onSelection] : []);
	const selectionRef = useRef<Record<string, TSelection>>({...defaultSelection, ...applySelection});
	const setSelection: (callback: (prev: Record<string, TSelection>) => Record<string, TSelection>) => void = prev => selectionRef.current = prev(selectionRef.current);

	useEffect(() => {
		setSelection(() => ({...defaultSelection, ...applySelection}));
	}, [JSON.stringify(defaultSelection)]);
	useEffect(() => {
		setSelection(() => ({...defaultSelection, ...applySelection}));
	}, [JSON.stringify(applySelection)]);

	const select: ISelectionContext<TSelection>["select"] = (id, $selection, select) => {
		setSelection(prev => {
			const $select = select === undefined ? !prev[id] : select;
			if (type === "single") {
				return $select ? {[id]: $selection} : {};
			}
			prev[id] = $selection;
			!$select && (delete prev[id]);
			return prev;
		});
		console.log("SelectionProvider: Selection timeout; selection", selectionRef.current);
	};
	const isSelected: ISelectionContext<TSelection>["isSelected"] = id => !!selectionRef.current[id];
	const toSelection: ISelectionContext<TSelection>["toSelection"] = () => Object.keys(selectionRef.current).filter(key => !!selectionRef.current[key]);
	const isEmpty: ISelectionContext<TSelection>["isEmpty"] = () => !toSelection().length;
	const toSingle: ISelectionContext<TSelection>["toSingle"] = () => {
		if (isEmpty()) {
			throw new Error("Selection is empty!");
		}
		return toSelection()[0];
	};
	const $selection = () => {
		const items = toSelection().reduce((prev, current) => ({...prev, [current]: selectionRef.current[current]}), {});
		return {
			isEmpty: isEmpty(),
			single: (() => {
				try {
					return selectionRef.current[toSingle()];
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
			isSelected,
			asSelection: () => selectionRef.current,
			toSelection,
			toItems: () => Object.values(selectionRef.current).filter(item => !!item),
			select,
			item: (item, $select) => select(item.id, item, $select),
			items: (items, $select) => items.map(item => select(item.id, item, $select)),
			isSelectedItem: item => isSelected(item.id),
			isEmpty,
			toSingle,
			onSelection: callback => onSelectionEvents.current.push(callback),
			selection: $selection,
			toSingleItem: () => selectionRef.current[toSingle()],
			handleSelection: () => {
				const selection = $selection();
				onSelectionEvents.current.map(callback => callback(selection));
			},
			clear: () => setSelection(() => ({})),
		}}
		{...props}
	/>;
}
