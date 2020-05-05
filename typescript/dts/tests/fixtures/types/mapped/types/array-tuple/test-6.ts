// @strict: true
// @declaration: true

type Box<T> = { value: T };
type Boxified<T> = { [P in keyof T]: Box<T[P]> };

type T40 = Boxified<A | A[] | ReadonlyArray<A> | [A, B] | string | string[]>;

type A = { a: string };
type B = { b: string };

type ReadWrite<T> = { -readonly [P in keyof T]: T[P] };

declare function unboxify<T>(x: Boxified<T>): T;

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
type Awaitified<T> = { [P in keyof T]: Awaited<T[P]> };

declare function all<T extends any[]>(...values: T): Promise<Awaitified<T>>;

// Repro from #26163

type ElementType<T> = T extends Array<infer U> ? U : never;
type Mapped<T> = { [K in keyof T]: T[K] };

type F<T> = ElementType<Mapped<T>>;
type R1 = F<[string, number, boolean]>;  // string | number | boolean
type R2 = ElementType<Mapped<[string, number, boolean]>>;  // string | number | boolean

// Repro from #26163

declare function acceptArray(arr: any[]): void;

declare function mapArray<T extends any[]>(arr: T): Mapped<T>;

function acceptMappedArray<T extends any[]>(arr: T) {
    acceptArray(mapArray(arr));
}

// Repro from #26163

type Unconstrained<T> = ElementType<Mapped<T>>;
type T1 = Unconstrained<[string, number, boolean]>;  // string | number | boolean

type Constrained<T extends any[]> = ElementType<Mapped<T>>;
type T2 = Constrained<[string, number, boolean]>;  // string | number | boolean
