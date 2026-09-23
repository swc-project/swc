export const accessors = {
    get [`\x41`](): number { return 1; },
    set [`\u0041`](value: number) {},
    get [`read\nonly`](): string { return "value"; },
} as const;
