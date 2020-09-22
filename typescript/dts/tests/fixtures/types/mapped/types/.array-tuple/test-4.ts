// @strict: true
// @declaration: true

type Box<T> = { value: T };
type Boxified<T> = { [P in keyof T]: Box<T[P]> };

type T40 = Boxified<A | A[] | ReadonlyArray<A> | [A, B] | string | string[]>;

type A = { a: string };
type B = { b: string };

type ReadWrite<T> = { -readonly [P in keyof T]: T[P] };

type T50 = Readonly<string[]>;
type T51 = Readonly<[number, number]>;
type T52 = Partial<Readonly<string[]>>;
type T53 = Readonly<Partial<string[]>>;
type T54 = ReadWrite<Required<T53>>;
