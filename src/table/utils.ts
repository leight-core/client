import {ColumnFilterItem} from "antd/lib/table/interface";
import {UseQueryResult} from "react-query";

export function toFilters<TResponse>(query: UseQueryResult<TResponse>, map: (data: TResponse) => ColumnFilterItem[]): ColumnFilterItem[] {
	return query.isSuccess ? map(query.data) : [];
}
