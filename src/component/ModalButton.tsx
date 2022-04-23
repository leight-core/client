import {isString} from "@leight-core/client";
import {Button, ButtonProps, Modal, ModalProps} from "antd";
import {FC, useState} from "react";
import {useTranslation} from "react-i18next";

export interface IModalButtonProps extends Omit<Partial<ModalProps>, "onOk"> {
	button?: ButtonProps;
	onOk?: (setShow: (show: boolean) => void) => void,
}

export const ModalButton: FC<IModalButtonProps> = ({button, onOk, ...props}) => {
	const {t} = useTranslation();
	const [show, setShow] = useState(false);
	if (button && isString(button.children)) {
		button.children = t(button.children as string);
	}
	if (props && isString(props.title)) {
		props.title = t(props.title as string);
	}
	if (props && isString(props.children)) {
		props.children = t(props.children as string);
	}
	return <>
		<Button
			{...button}
			onClick={() => setShow(true)}
		/>
		<Modal
			visible={show}
			onCancel={() => setShow(false)}
			onOk={onOk ? () => onOk(setShow) : () => setShow(false)}
			cancelText={t("common.modal.cancel.button")}
			{...props}
		/>
	</>;
};
