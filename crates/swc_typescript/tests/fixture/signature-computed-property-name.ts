export interface A {
    ["foo" as string]: number;
    ["bar" as string](a: number): string;
}

export type B = {
    ["foo" as string]: number;
    ["bar" as string](a: number): string;
};

export type C = {
    [D?.b]: number;
};
