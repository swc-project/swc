// @strict: true
// @declaration: true

type T0 = string & `${string}`;  // string
type T1 = string & `${number}`;  // `${number}
type T2 = string & `${bigint}`;  // `${bigint}
type T3<T extends string> = string & `${T}`;  // `${T}
type T4<T extends string> = string & `${Capitalize<`${T}`>}`;  // `${Capitalize<T>}`

function f1(a: boolean[], x: `${number}`) {
    let s = a[x];  // boolean
}

function f2(a: boolean[], x: number | `${number}`) {
    let s = a[x];  // boolean
}

type T10 = boolean[][`${number}`];  // boolean
type T11 = boolean[][number | `${number}`];  // boolean

type T20<T extends number | `${number}`> = T;
type T21<T extends unknown[]> = { [K in keyof T]: T20<K> };

type Container<T> = {
    value: T
}

type UnwrapContainers<T extends Container<unknown>[]> = { [K in keyof T]: T[K]['value'] };

declare function createContainer<T extends unknown>(value: T): Container<T>;

declare function f<T extends Container<unknown>[]>(containers: [...T], callback: (...values: UnwrapContainers<T>) => void): void;

const container1 = createContainer('hi')
const container2 = createContainer(2)

f([container1, container2], (value1, value2) => {
    value1;  // string
    value2;  // number
});
