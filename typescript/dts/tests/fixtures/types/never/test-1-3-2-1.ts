function f2(x: string | number) {
    if (typeof x === "boolean") {
        return x;  // never
    }
}

