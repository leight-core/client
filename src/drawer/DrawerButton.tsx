import {ITranslationProps} from "@leight-core/api";
import {
	Drawer,
	IDrawerProps,
	Translate,
	UseToken,
	VisibleContext,
	VisibleProvider
}                          from "@leight-core/client";
import {
	Button,
	ButtonProps,
	Tooltip
}                          from "antd";
import {
	ComponentProps,
	FC,
	ReactNode
}                          from "react";

export interface IDrawerButtonProps extends Partial<Omit<ButtonProps, "title">> {
	label?: ReactNode | string;
	translation?: ITranslationProps;
	tooltip?: string;
	width?: string | number;
	drawerProps?: IDrawerProps;
	tokens?: ComponentProps<typeof UseToken>["tokens"];
}

/**
 * Default Antd button without any preset; just the drawer is shown on click.
 */
export const DrawerButton: FC<IDrawerButtonProps> = (
	{
		children,
		onClick,
		label,
		translation,
		tooltip,
		width = 600,
		drawerProps,
		tokens,
		...props
	}) => {
	return <Tooltip title={tooltip ? <Translate {...translation} text={tooltip}/> : undefined}>
		<VisibleProvider>
			<VisibleContext.Consumer>
				{visibleContext => <>
					<Drawer
						translation={translation}
						width={width}
						{...drawerProps}
					>
						{children}
					</Drawer>
					<UseToken tokens={tokens}>
						<Button
							onClick={event => {
								visibleContext.show();
								onClick?.(event as any);
							}}
							{...props}
						>
							<span>
								<Translate
									{...translation}
									text={label}
								/>
							</span>
						</Button>
					</UseToken>
				</>}
			</VisibleContext.Consumer>
		</VisibleProvider>
	</Tooltip>;
};
