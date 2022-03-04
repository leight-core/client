import deepmerge from "deepmerge";

export const merge = <T1, T2>(x: Partial<T1>, y: Partial<T2>): T1 & T2 => {
	return deepmerge<T1, T2>(x, y);
};
