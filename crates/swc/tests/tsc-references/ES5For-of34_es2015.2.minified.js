function foo() {
    return {
        x: 0
    };
}
for (foo().x of [
    'a',
    'b',
    'c'
])foo().x;
