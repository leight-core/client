import {IFormItemContext} from "@leight-core/api";
import {FormItemContext, useFormContext, useOptionalItemGroupContext} from "@leight-core/client";
import {Form, FormItemProps, Input} from "antd";
import {NamePath, Rule} from "rc-field-form/lib/interface";
import {cloneElement, FC} from "react";
import {useTranslation} from "react-i18next";

export interface IFormItemProps extends Partial<FormItemProps> {
	/**
	 * Field name; also used for translations.
	 */
	field: NamePath;
	path?: NamePath;
	/**
	 * Attach required validation rule?
	 */
	required?: boolean;
	/**
	 * Show Antd Form.Item label.
	 */
	showLabel?: boolean;
	/**
	 * Disable default Antd Form.Item margin.
	 */
	noMargin?: boolean;
	labels?: string[] | string;
	hasTooltip?: boolean;

	onNormalize?(value: any, formItemContext: IFormItemContext): void,
}

export const FormItem: FC<IFormItemProps> = (
	{
		field,
		path = field,
		required = false,
		showLabel = true,
		noMargin = false,
		children = <Input/>,
		labels = [],
		hasTooltip = false,
		onNormalize,
		...props
	}) => {
	const {t} = useTranslation();
	if (noMargin) {
		props.style = {margin: 0};
	}
	const formContext = useFormContext();
	const itemGroupContext = useOptionalItemGroupContext();
	field = ([] as (string | number)[]).concat(itemGroupContext ? itemGroupContext.prefix : [], Array.isArray(field) ? field : [field]);
	const fieldName = Array.isArray(field) ? field.join(".") : field;
	const rules: Rule[] = [];
	labels = Array.isArray(labels) ? labels : [labels];
	formContext.translation && labels.push(formContext.translation + "." + fieldName + ".label");
	itemGroupContext?.translation && labels.push(itemGroupContext.translation + "." + fieldName + ".label");
	required && rules.push({
		required: true,
		message: t(["form-item." + fieldName + ".required"].concat(labels.map(item => item + ".required"))) as string,
	});
	/**
	 * This is... a hack I really don't understand! But it works.
	 *
	 * The idea is to clear errors set from form context and this solution could do that with ease!
	 */
	rules.push(() => ({validator: () => Promise.resolve()}));
	props.tooltip = props.tooltip ? t("" + props.tooltip) : props.tooltip;
	formContext.translation && hasTooltip && (props.tooltip = t(formContext.translation + "." + fieldName + ".label.tooltip"));
	itemGroupContext?.translation && hasTooltip && (props.tooltip = t(itemGroupContext.translation + "." + fieldName + ".label.tooltip"));
	const context: IFormItemContext = {
		field,
		label: t(["form-item." + fieldName + ".label"].concat(labels)) as string,
		getValue: () => formContext.form.getFieldValue(path),
		setValue: value => formContext.form.setFields([{name: path, value}]),
		setErrors: (errors: string[]) => {
			setTimeout(() => {
				formContext.form.setFields([{name: path, errors: errors.map(item => t(item))}]);
			}, 0);
		},
	};
	onNormalize && !props.normalize && (props.normalize = value => onNormalize(value, context));
	return <FormItemContext.Provider value={context}>
		<Form.Item
			name={field}
			label={showLabel === false ? null : t(["form-item." + fieldName + ".label"].concat(labels))}
			rules={rules}
			{...props}
		>
			{children ? cloneElement(children as any, {["data-required"]: required}) : null}
		</Form.Item>
	</FormItemContext.Provider>;
};
