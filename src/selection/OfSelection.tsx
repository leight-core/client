import {ISelectionContext, IWithIdentity} from "@leight-core/api";
import {useSelectionContext} from "@leight-core/client";
import {useEffect} from "react";

export interface IOfSelectionProps<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any> {
	value?: TOnChange;

	/**
	 * Resolves values of selection into selection context.
	 *
	 * @param value
	 * @param selectionContext
	 */
	ofSelection(value: TOnChange | undefined, selectionContext: ISelectionContext<TItem>): void;
}

/**
 * This is a utility component used to translate selected values (usually IDs) into an actual selection context.
 *
 * @param value
 * @param ofSelection
 * @constructor
 */
export function OfSelection<TItem extends Record<string, any> & IWithIdentity = any, TOnChange = any>(
	{
		value,
		ofSelection,
	}: IOfSelectionProps<TItem, TOnChange>) {
	const selectionContext = useSelectionContext<TItem>();
	useEffect(() => {
		console.log("Running OfSelection with value", value);
		ofSelection(value, selectionContext);
	}, [value]);
	return null;
}
