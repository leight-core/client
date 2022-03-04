import {EntityContext} from "@leight-core/client";
import {PropsWithChildren, useState} from "react";

export interface IEntityProviderProps<TEntity> {
	defaultEntity?: TEntity;
}

export const EntityProvider = <TEntity, >({defaultEntity, ...props}: PropsWithChildren<IEntityProviderProps<TEntity>>) => {
	const [entity, update] = useState<TEntity | undefined | null>(defaultEntity);
	return <EntityContext.Provider
		value={{
			entity,
			optional: () => entity,
			required: () => {
				if (!entity) {
					throw new Error("Requested an Entity which is not set.");
				}
				return entity;
			},
			update,
		}}
		{...props}
	/>;
};
