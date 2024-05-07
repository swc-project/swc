function foo() {
    let arr = [];
    arr = [
        1,
        2,
        3
    ];
    // NOTE: `return { arr }` works fine
    return {
        arr: arr
    };
}
foo();
