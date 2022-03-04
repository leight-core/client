import {ArrowDownOutlined, ArrowUpOutlined, DashOutlined} from "@ant-design/icons";
import {useSourceContext} from "@leight-core/client";
import {Button, Space, Tooltip} from "antd";
import {useTranslation} from "react-i18next";

export interface IOrderButtonProps<TOrderBy> {
	orderBy: keyof TOrderBy;
	prefix: string;
}

export const OrderButton = <TOrderBy, >({orderBy, prefix}: IOrderButtonProps<TOrderBy>) => {
	const sourceContext = useSourceContext<any, any, any, any>();
	const order = sourceContext.orderBy ? sourceContext.orderBy[orderBy] : undefined;
	const {t} = useTranslation();
	const label = t("order-by.label." + prefix + "." + orderBy);
	return <Space size={"small"}>
		<Button
			icon={
				(order === undefined && <Tooltip title={t("common.order.undefined.tooltip")}><DashOutlined/></Tooltip>) ||
				(order === true && <Tooltip title={t("common.order.ascending.tooltip")}><ArrowUpOutlined/></Tooltip>) ||
				(order === false && <Tooltip title={t("common.order.descending.tooltip")}><ArrowDownOutlined/></Tooltip>)
			}
			type={"link"}
			size={"small"}
			onClick={() => sourceContext.setOrderBy({[orderBy]: !order})}
		>
			{(order === undefined && <Tooltip title={t("common.order.undefined.tooltip")}>{label}</Tooltip>) ||
				(order === true && <Tooltip title={t("common.order.ascending.tooltip")}>{label}</Tooltip>) ||
				(order === false && <Tooltip title={t("common.order.descending.tooltip")}>{label}</Tooltip>)}
		</Button>
	</Space>;
};
