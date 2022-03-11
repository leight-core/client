import {IQueryParams} from "@leight-core/api";
import {Button, ButtonProps} from "antd";
import Link from "next/link";
import React, {FC} from "react";
import {useTranslation} from "react-i18next";

export interface IButtonLinkProps extends Omit<ButtonProps, "title"> {
	/**
	 * Href goes to generate method (clever link).
	 */
	href: string;
	/**
	 * Title of a button.
	 */
	title?: string | null;
	/**
	 * Optional params for the link generator.
	 */
	query?: IQueryParams | void;
}

export const ButtonLink: FC<IButtonLinkProps> = ({href, title, query, ...props}) => {
	const {t} = useTranslation();
	try {
		return <Link href={{pathname: href, query: query || undefined}}>
			<Button
				type={"primary"}
				{...props}
			>
				{title ? t(title) : null}
			</Button>
		</Link>;
	} catch (e) {
		console.warn(`Cannot generate link [${href}] for ButtonLink. Params:`, query, e);
		return <Button
			type={"primary"}
			disabled
			{...props}
		>
			{title ? t(title) : null}
		</Button>;
	}
};
