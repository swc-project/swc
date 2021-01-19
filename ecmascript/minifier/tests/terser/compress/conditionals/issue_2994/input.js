function f(condition1, condition2, condition3) {
    if (condition1) {
        if (condition2) {
            return aValue;
        } else {
            const variable1 = "something";
            if (condition3) {
                const variable2 = "else";
                return anotherValue;
            } else {
                return undefined;
            }
        }
    }
}
let aValue = 2,
    anotherValue = 3;
for (let i = 0; i < 8; ++i) {
    console.log(f(i & 4, i & 2, i & 1));
}
