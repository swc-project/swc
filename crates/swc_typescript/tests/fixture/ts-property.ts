const A = "123";
const B = "456";
export interface I {
    [A]: "123";
    [B]: "456";
}

export const foo = {
    "foo"(): string {
        return "foo";
    },
    ["bar"](): string {
        return "bar";
    },
    123(): string {
        return "123";
    },
    [456](): string {
        return "456";
    },
    1n(): string {
        return "1n";
    },
    [`x\ny`](): string {
        return "x\ny";
    },
};
