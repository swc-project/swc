function foo(...args: [number, string?, ...number[]]) {}

type MixedRest = [number?, ...rest: string[]];
type GenericRest<T extends unknown[]> = [number?, ...rest: T];
