import {isString} from "@leight-core/utils";
import {Button, ButtonProps, Modal, ModalProps} from "antd";
import {ComponentProps, FC, useState} from "react";
import {useTranslation} from "react-i18next";
import {UseToken} from "../user";

export interface IModalButtonProps extends Omit<Partial<ModalProps>, "onOk"> {
	button?: ButtonProps;
	onOk?: (setShow: (show: boolean) => void) => void,
	tokens?: ComponentProps<typeof UseToken>["tokens"];
}

export const ModalButton: FC<IModalButtonProps> = ({button, onOk, tokens, ...props}) => {
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
		<UseToken tokens={tokens}>
			<Button
				type={"link"}
				size={"large"}
				{...button}
				onClick={() => setShow(true)}
			/>
		</UseToken>
		<Modal
			visible={show}
			onCancel={() => setShow(false)}
			onOk={onOk ? () => onOk(setShow) : () => setShow(false)}
			cancelButtonProps={{
				type: "text",
				size: "large",
			}}
			cancelText={t("common.modal.cancel.button")}
			{...props}
		/>
	</>;
};
