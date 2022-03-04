import {CancelOrderButton, OrderButton} from "@leight-core/client";
import {Divider, Space, SpaceProps} from "antd";

export interface IOrderButtonBarProps<TOrderBy> extends Partial<SpaceProps> {
	showCancelButton?: boolean;
	buttons: (keyof TOrderBy)[];
	prefix: string;
}

export const OrderButtonBar = <TOrderBy, >({showCancelButton = true, buttons, prefix, ...props}: IOrderButtonBarProps<TOrderBy>) => {
	return <Space split={<Divider type={"vertical"}/>} size={1} {...props}>
		{buttons.map(item => <OrderButton<TOrderBy> prefix={prefix} key={item as string} orderBy={item}/>)}
		{showCancelButton && <CancelOrderButton/>}
	</Space>;
};
