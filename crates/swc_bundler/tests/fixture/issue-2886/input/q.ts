export namespace Test {
    // should not merge with the other namespace
    export enum TestEnum {
        A = 2,
    }
}

export enum TestEnum {
    A = 3,
}