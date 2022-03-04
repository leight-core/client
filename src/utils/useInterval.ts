import {DependencyList, useEffect, useRef} from "react";

export type IIntervalCallback = () => any

export function useInterval(callback: IIntervalCallback, delay?: number, deps: DependencyList = []) {
	const ref = useRef<IIntervalCallback>(() => null);

	useEffect(() => {
		ref.current = callback;
	}, [callback]);

	useEffect(() => delay && callback(), []);

	useEffect(() => {
		function tick() {
			return ref.current();
		}

		if (delay) {
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay].concat(deps));
}
