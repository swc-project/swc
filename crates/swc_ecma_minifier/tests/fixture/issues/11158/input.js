(() => {
    const gen = () => foo(12);
    function foo(length) {
        return length;
    }
    const a = `tmp-${gen()}-a`,
        b = `tmp-${gen()}-b`;
    console.log(a, b);
})();

(() => {
    const gen = () => g(foo(12));
    function foo(length) {
        return length;
    }
    const a = `tmp-${gen()}-a`,
        b = `tmp-${gen()}-b`;
    console.log(a, b);
})();
