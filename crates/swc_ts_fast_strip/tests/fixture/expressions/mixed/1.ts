const foo = {
    foo: 1 as number,
    bar: "bar" as any as number,
    baz: foo<string> as const,
} satisfies number;
const bar = "bar";