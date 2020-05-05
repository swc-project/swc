// Repro from #12625

interface Options2<Data, Computed> {
    data?: Data
    computed?: Computed;
}

declare class Component2<Data, Computed> {
    constructor(options: Options2<Data, Computed>);

    get<K extends keyof Data | keyof Computed>(key: K): (Data & Computed)[K];
}
