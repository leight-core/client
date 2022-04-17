import {PlacementType} from "@leight-core/api";
import {Drawer, DrawerContext, DrawerProvider, isString, useMobile} from "@leight-core/client";
import {Button, ButtonProps, DrawerProps} from "antd";
import {PushState} from "antd/lib/drawer";
import {FC, ReactNode} from "react";
import {useTranslation} from "react-i18next";

export interface IDrawerButtonProps extends Partial<ButtonProps> {
	label?: ReactNode | string;
	title?: string;
	values?: any;
	/**
	 * Optional drawer width.
	 */
	width?: string | number;
	height?: string | number;
	drawerProps?: DrawerProps;
	placement?: PlacementType;
	push?: boolean | PushState;
	fullscreen?: boolean;
}

/**
 * Default Antd button without any preset; just the drawer is shown on click.
 */
export const DrawerButton: FC<IDrawerButtonProps> = ({children, onClick, label, title, values, width = 600, height, placement = "right", push = false, fullscreen = false, drawerProps, ...props}) => {
	const {t} = useTranslation();
	const mobile = useMobile();
	fullscreen && (width = "100vw") && (height = "100vh");
	return <DrawerProvider>
		<DrawerContext.Consumer>
			{drawerContext => <>
				<Drawer
					title={title ? t(title, {data: values}) : null}
					width={mobile("100vw", width)}
					height={height}
					headerStyle={mobile({padding: "8px 4px"})}
					bodyStyle={{overflowY: "scroll", padding: mobile("4px")}}
					placement={placement}
					push={push}
					{...drawerProps}
				>
					{children}
				</Drawer>
				<Button
					onClick={event => {
						drawerContext.setVisible(true);
						onClick?.(event);
					}}
					{...props}
				>
					{isString(label) ? t(label as string, {data: values}) : label}
				</Button>
			</>}
		</DrawerContext.Consumer>
	</DrawerProvider>;
};
