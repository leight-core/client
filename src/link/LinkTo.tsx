import Link from "next/link";
import {FC} from "react";
import {IQueryParams} from "@leight-core/api";

export interface ILinkToProps {
	/**
	 * Target href; could be template path, will be expanded by a LinkContext.
	 */
	href: string;
	/**
	 * Optional params used to generate a link.
	 */
	query?: IQueryParams;
}

/**
 * Wrapper component over Next Link with underlying <a> with children passed through.
 */
export const LinkTo: FC<ILinkToProps> = ({href, query, ...props}) => {
	return <Link href={{pathname: href, query: query || undefined}}>
		<a {...props}/>
	</Link>;
};
