import { c as _c } from "react/compiler-runtime";
const model = {
    id: "model",
    count: 1
};
type Primitive = string | number | boolean | null | undefined | symbol | bigint;
type LiteralStates = "ready" | 1 | true | 2n | `item-${string}`;
type ItemTuple = [name: string, count?: number, ...flags: boolean[]];
type TupleModifiers = [string?, ...number[]];
type ReadonlyNames = readonly string[];
type Parenthesized = (string | number)[];
type Indexed = Model["id"];
type Query = typeof model;
type ImportQuery = typeof import("./remote").model;
type ImportWithOptions = import("./remote.json", {
    with: {
        type: "json"
    }
});
type Remote = import("./remote").RemoteType<string>;
type InstanceFactory = abstract new(name: string) => StoreInstance;
type Predicate = (value: unknown, ...rest: number[]) => value is StoreInstance;
type Assertion = (value: unknown) => asserts value is StoreInstance;
type Unwrap<T> = T extends Promise<infer Value> ? Value : never;
type Accessors<T extends keyof Model = "id"> = {
    readonly [K in T as `get${Capitalize<string & K>}`]?: Model[K];
};
interface Model {
    id: string;
    count: number;
}
interface StoreInstance {
    value: string;
}
interface Store<T extends React.ComponentType<any>> extends Base.Store<T> {
    new(name: string): StoreInstance;
    (id: string) : StoreInstance;
    readonly [key: string]: string | number;
    get value(): string;
    set value(next: string);
    optional?: T[];
    method<U extends Primitive>(this: this, input: U): U & object;
}
export type { Accessors, Assertion, ImportQuery, ImportWithOptions, Indexed, InstanceFactory, ItemTuple, LiteralStates, Parenthesized, Predicate, Primitive, Query, ReadonlyNames, Remote, Store, TupleModifiers, Unwrap };
export function App() {
    const $ = _c(1);
    let t0;
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
        t0 = <div data-kind="types"/>;
        $[0] = t0;
    } else {
        t0 = $[0];
    }
    return t0;
}
