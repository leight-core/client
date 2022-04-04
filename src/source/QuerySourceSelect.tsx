import {isString, useOptionalFilterContext, useOptionalFormContext, useOptionalFormItemContext, useSourceContext, useUpdate} from "@leight-core/client";
import {IBaseSelectOption, IToOptionMapper} from '@leight-core/api';
import {Empty, Select, SelectProps} from "antd";
import React, {PropsWithChildren, useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";

export interface IQuerySourceValue<TResponse> extends IBaseSelectOption {
	entity: TResponse;
}

export interface IQuerySourceSelectProps<TResponse> extends Partial<Omit<SelectProps<string, IQuerySourceValue<TResponse>>, "onSelect">> {
	/**
	 * Map requested data into Select's options.
	 */
	toOption: IToOptionMapper<TResponse>;
	/**
	 * Use label as placeholder for the select.
	 */
	usePlaceholder?: boolean;
	/**
	 * When this "something" changes, input is cleared (value set to undefined); this can be used to externally
	 * clear this input on change.
	 */
	clearOn?: any;
	/**
	 * When se to true, select will filter values set.
	 */
	filter?: boolean;
	disableOnEmpty?: boolean;
	/**
	 * Debounce interval in ms.
	 */
	debounce?: number;
	onSelect?: (value: IQuerySourceValue<TResponse>) => void;
	labelPrefix?: string;
}

export const QuerySourceSelect = <TResponse, >(
	{
		toOption,
		/**
		 * Value extracted from props for to prevent showing it in the placeholder Select.
		 */
		value,
		debounce = 200,
		clearOn = false,
		usePlaceholder,
		showSearch = false,
		filter = showSearch,
		disableOnEmpty = true,
		onSelect,
		labelPrefix,
		...props
	}: PropsWithChildren<IQuerySourceSelectProps<TResponse>>) => {
	const tid = useRef<any>();
	const {t} = useTranslation();
	const sourceContext = useSourceContext<TResponse>();
	const filterContext = useOptionalFilterContext<any>();
	const formContext = useOptionalFormContext();
	const formItemContext = useOptionalFormItemContext();
	formItemContext && usePlaceholder && (props.placeholder = formItemContext.label);
	useUpdate([clearOn], () => {
		clearOn !== false && formItemContext && formContext && formContext.form.setFields([
			{name: formItemContext.field, value: undefined},
		]);
	});
	useEffect(() => {
		filter && filterContext?.setFilter({id: value} as any);
	}, [value]);

	const _onSelect: any = (value: string, option: IQuerySourceValue<TResponse>) => onSelect?.(option);

	return sourceContext.result.isSuccess ? <Select<string, IQuerySourceValue<TResponse>>
		options={sourceContext.result.data.items.map(entity => {
			const option = toOption(entity);
			return ({
				value: option.value,
				label: isString(option.label) ? t((labelPrefix || '') + option.label, option.label) : option.label,
				entity,
			})
		})}
		onSelect={_onSelect}
		loading={sourceContext.result.isFetching}
		filterOption={() => true}
		showSearch={showSearch}
		notFoundContent={<Empty description={t("common.nothing-found")}/>}
		onSearch={showSearch ? fulltext => {
			clearTimeout(tid.current);
			tid.current = setTimeout(() => filterContext?.setFilter({fulltext}), debounce);
		} : undefined}
		onClear={() => filterContext?.setFilter()}
		disabled={!showSearch && disableOnEmpty && !sourceContext.hasData()}
		value={value}
		{...props}
	/> : <Select<string, IQuerySourceValue<TResponse>>
		showSearch={showSearch}
		loading={sourceContext.result.isLoading}
		disabled={disableOnEmpty}
		onSelect={_onSelect}
		{...props}
	/>;
};
