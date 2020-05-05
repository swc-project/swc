// @strict: true
// @declaration: true

type Box<T> = { value: T };
type Boxified<T> = { [P in keyof T]: Box<T[P]> };

type T20 = Boxified<(string | undefined)[]>;
type T21 = Partial<(string | undefined)[]>;
type T22 = Required<(string | undefined)[]>;
type T23 = Boxified<ReadonlyArray<string | undefined>>;
type T24 = Partial<ReadonlyArray<string | undefined>>;
type T25 = Required<ReadonlyArray<string | undefined>>;

type T30 = Boxified<Partial<string[]>>;
type T31 = Partial<Boxified<string[]>>;

type A = { a: string };
type B = { b: string };
