export function foo() {
    for (; size--;)
        if (!(result = eq(
            a[size],
            b[size],
            aStack,
            bStack
        ))) break;
}