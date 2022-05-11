import {IQueryParams} from "@leight-core/api";
import {isString} from "@leight-core/client";
import {Button} from "antd";
import Link from "next/link";
import React, {ComponentProps, FC} from "react";
import {useTranslation} from "react-i18next";

export interface IButtonLinkProps extends Partial<ComponentProps<typeof Button>> {
	/**
	 * Href goes to generate method (clever link).
	 */
	href: string;
	/**
	 * Title of a button.
	 */
	label?: string | null;
	/**
	 * Optional params for the link generator.
	 */
	query?: IQueryParams | void;
}

export const ButtonLink: FC<IButtonLinkProps> = ({href, label, query, ...props}) => {
	const {t} = useTranslation();
	try {
		return <Link href={{pathname: href, query: query || undefined}}>
			<Button
				type={"link"}
				size={"large"}
				{...props}
			>
				{isString(label) ? t(label as string) : label}
			</Button>
		</Link>;
	} catch (e) {
		console.warn(`Cannot generate link [${href}] for ButtonLink. Params:`, query, e);
		return <Button
			type={"link"}
			size={"large"}
			disabled
			{...props}
		>
			{isString(label) ? t(label as string) : label}
		</Button>;
	}
};
