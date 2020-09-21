// Repro from #23940

interface I7 {
    x: any;
}

type Foo7<T extends number> = T;

declare function f7<K extends keyof I7>(type: K): Foo7<I7[K]>;
