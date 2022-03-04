import {useContext} from "@leight-core/client";
import {createContext} from "react";
import {IEntityContext} from "@leight-core/api";

export const EntityContext = createContext(null as unknown as IEntityContext<any>);

export const useEntityContext = <TEntity>(): IEntityContext<TEntity> => useContext(EntityContext, "EntityContext");
