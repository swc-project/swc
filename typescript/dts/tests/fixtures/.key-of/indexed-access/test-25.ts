// Repro from #12624

interface Options1<Data, Computed> {
    data?: Data
    computed?: Computed;
}

declare class Component1<Data, Computed> {
    constructor(options: Options1<Data, Computed>);

    get<K extends keyof (Data & Computed)>(key: K): (Data & Computed)[K];
}

let c1 = new Component1({
    data: {
        hello: ""
    }
});

c1.get("hello");

