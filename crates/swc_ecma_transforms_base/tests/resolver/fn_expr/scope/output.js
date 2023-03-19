test(function foo__3() {
    foo__3 = function foo__5(x__6) {
        return x__6 === 0 ? 1 : 1 + foo__5(x__6 - 1);
    };
    return foo__3(10);
});
