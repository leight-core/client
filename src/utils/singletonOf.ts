export const singletonOf = <T>(func: () => T): () => T => {
	let $instance: T | undefined;
	return () => $instance || ($instance = func());
};
