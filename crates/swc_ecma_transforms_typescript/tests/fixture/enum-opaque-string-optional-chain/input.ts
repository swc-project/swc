enum E {
    A = `x${1 as number}`,
}
enum Present {
    direct = E?.A,
    computed = E?.["A"],
}
if (Present.direct !== "x1" || Present.computed !== "x1" || Present["x1"] !== undefined) {
    throw new Error("Optional chaining changed a present string member");
}

eval("E = null");
enum Nullish {
    direct = E?.A,
    computed = E?.["A"],
}
if (Nullish.direct !== undefined || Nullish.computed !== undefined) {
    throw new Error("Optional chaining did not guard a null enum");
}

eval("E = undefined");
enum Missing {
    direct = E?.A,
    computed = E?.["A"],
}
if (Missing.direct !== undefined || Missing.computed !== undefined) {
    throw new Error("Optional chaining did not guard an undefined enum");
}
