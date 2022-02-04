// @strict: true
// @declaration: true

// Mapped type 'as N' clauses

type Getters<T> = { [P in keyof T & string as `get${Capitalize<P>}`]: () => T[P] };
type TG1 = Getters<{ foo: string, bar: number, baz: { z: boolean } }>;

// Mapped type with 'as N' clause has no constraint on 'in T' clause

type PropDef<K extends keyof any, T> = { name: K, type: T };

type TypeFromDefs<T extends PropDef<keyof any, any>> = { [P in T as P['name']]: P['type'] };

type TP1 = TypeFromDefs<{ name: 'a', type: string } | { name: 'b', type: number } | { name: 'a', type: boolean }>;

// No array or tuple type mapping when 'as N' clause present

type TA1 = Getters<string[]>;
type TA2 = Getters<[number, boolean]>;

// Filtering using 'as N' clause

type Methods<T> = { [P in keyof T as T[P] extends Function ? P : never]: T[P] };
type TM1 = Methods<{ foo(): number, bar(x: string): boolean, baz: string | number }>;

// Mapping to multiple names using 'as N' clause

type DoubleProp<T> = { [P in keyof T & string as `${P}1` | `${P}2`]: T[P] }
type TD1 = DoubleProp<{ a: string, b: number }>;  // { a1: string, a2: string, b1: number, b2: number }
type TD2 = keyof TD1;  // 'a1' | 'a2' | 'b1' | 'b2'
type TD3<U> = keyof DoubleProp<U>;  // `${keyof U & string}1` | `${keyof U & string}2`

// Repro from #40619

type Lazyify<T> = {
    [K in keyof T as `get${Capitalize<K & string>}`]: () => T[K]
};

interface Person {
    readonly name: string;
    age: number;
    location?: string;
}

type LazyPerson = Lazyify<Person>;

// Repro from #40833

type Example = {foo: string, bar: number};

type PickByValueType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
};

type T1 = PickByValueType<Example, string>;
const e1: T1 = {
    foo: "hello"
};
type T2 = keyof T1;
const e2: T2 = "foo";

// Repro from #41133

interface Car {
    name: string;
    seats: number;
    engine: Engine;
    wheels: Wheel[];
}

interface Engine {
    manufacturer: string;
    horsepower: number;
}

interface Wheel {
    type: "summer" | "winter";
    radius: number;
}

type Primitive = string | number | boolean;
type OnlyPrimitives<T> = { [K in keyof T as T[K] extends Primitive ? K : never]: T[K] };

let primitiveCar: OnlyPrimitives<Car>;  // { name: string; seats: number; }
let keys: keyof OnlyPrimitives<Car>;  //  "name" | "seats"

type KeysOfPrimitives<T> = keyof OnlyPrimitives<T>;

let carKeys: KeysOfPrimitives<Car>;  // "name" | "seats"

// Repro from #41453

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false;

type If<Cond extends boolean, Then, Else> = Cond extends true ? Then : Else;

type GetKey<S, V> = keyof { [TP in keyof S as Equal<S[TP], V> extends true ? TP : never]: any };

type GetKeyWithIf<S, V> = keyof { [TP in keyof S as If<Equal<S[TP], V>, TP, never>]: any };

type GetObjWithIf<S, V> = { [TP in keyof S as If<Equal<S[TP], V>, TP, never>]: any };

type Task = {
  isDone: boolean;
};

type Schema = {
  root: {
    title: string;
    task: Task;
  }
  Task: Task;
};

type Res1 = GetKey<Schema, Schema['root']['task']>;  // "Task"
type Res2 = GetKeyWithIf<Schema, Schema['root']['task']>;  // "Task"
type Res3 = keyof GetObjWithIf<Schema, Schema['root']['task']>;  // "Task"

// Repro from #44019

type KeysExtendedBy<T, U> = keyof { [K in keyof T as U extends T[K] ? K : never] : T[K] };

interface M {
    a: boolean;
    b: number;
}

function f(x: KeysExtendedBy<M, number>) {
    return x;
}

f("a");  // Error, should allow only "b"

type NameMap = { 'a': 'x', 'b': 'y', 'c': 'z' };

// Distributive, will be simplified

type TS0<T> = keyof { [P in keyof T as keyof Record<P, number>]: string };
type TS1<T> = keyof { [P in keyof T as Extract<P, 'a' | 'b' | 'c'>]: string };
type TS2<T> = keyof { [P in keyof T as P & ('a' | 'b' | 'c')]: string };
type TS3<T> = keyof { [P in keyof T as Exclude<P, 'a' | 'b' | 'c'>]: string };
type TS4<T> = keyof { [P in keyof T as NameMap[P & keyof NameMap]]: string };
type TS5<T> = keyof { [P in keyof T & keyof NameMap as NameMap[P]]: string };
type TS6<T, U, V> = keyof { [ K in keyof T as V & (K extends U ? K : never)]: string };

// Non-distributive, won't be simplified

type TN0<T> = keyof { [P in keyof T as T[P] extends number ? P : never]: string };
type TN1<T> = keyof { [P in keyof T as number extends T[P] ? P : never]: string };
type TN2<T> = keyof { [P in keyof T as 'a' extends P ? 'x' : 'y']: string };
type TN3<T> = keyof { [P in keyof T as Exclude<Exclude<Exclude<P, 'c'>, 'b'>, 'a'>]: string };
type TN4<T, U> = keyof { [K in keyof T as (K extends U ? T[K] : never) extends T[K] ? K : never]: string };
type TN5<T, U> = keyof { [K in keyof T as keyof { [P in K as T[P] extends U ? K : never]: true }]: string };
