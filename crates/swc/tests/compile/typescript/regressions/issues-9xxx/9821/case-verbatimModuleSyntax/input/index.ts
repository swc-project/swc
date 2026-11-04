export namespace ns {
    export declare let a: number;
    a = 1;
}

export namespace ns2 {
    a = 1;
    export declare let a: number;
}

export namespace ns3 {
    export let b = a;
    export declare const a: number;
}

export namespace ns4 {
    export namespace ns5 {
        export let b = a;
    }

    export declare const a: number;
}
