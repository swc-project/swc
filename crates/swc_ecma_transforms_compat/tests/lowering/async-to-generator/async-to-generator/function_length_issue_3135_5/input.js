
const foo = async function foo(x, y, ...z) {
    if (x) {
        return foo(0, y);
    }
    return 0;
};
