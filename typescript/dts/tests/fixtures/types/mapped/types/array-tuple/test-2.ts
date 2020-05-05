// @strict: true
// @declaration: true

type Box<T> = { value: T };
type Boxified<T> = { [P in keyof T]: Box<T[P]> };

type T00 = Boxified<[number, string?, ...boolean[]]>;
type T01 = Partial<[number, string?, ...boolean[]]>;
type T02 = Required<[number, string?, ...boolean[]]>;

type T10 = Boxified<string[]>;
type T11 = Partial<string[]>;
type T12 = Required<string[]>;
type T13 = Boxified<ReadonlyArray<string>>;
type T14 = Partial<ReadonlyArray<string>>;
type T15 = Required<ReadonlyArray<string>>;
