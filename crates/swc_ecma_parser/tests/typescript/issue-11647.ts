type Box<T> = { value: T };

const id = <T>(value: T) => value;

const callResult = id<Box<number>>({ value: 1 });

const \u0066oo = 1;
const bar = 2;
const baz = 3;

// Keep this as a relational expression after speculative TS parsing fails.
const relational = \u0066oo < bar > baz;

declare const maybe: <T>(x: T) => T;
const maybeResult = maybe<string>("ok");
