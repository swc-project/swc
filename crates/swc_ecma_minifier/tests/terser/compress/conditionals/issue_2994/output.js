function f(condition1, condition2, condition3) {
    if (condition1) {
        if (condition2) return aValue;
        {
            const variable1 = "something";
            if (!condition3) return;
            {
                const variable2 = "else";
                return anotherValue;
            }
        }
    }
}
let aValue = 2, anotherValue = 3;
for(let i = 0; i < 8; ++i)console.log(f(4 & i, 2 & i, 1 & i));
