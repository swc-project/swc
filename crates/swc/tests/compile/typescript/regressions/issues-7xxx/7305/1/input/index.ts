type SubtypeGuard<in P, out C extends P> = (object: P) => object is C;

export type IdTypeGuard<out T extends string> = SubtypeGuard<string, T>;
