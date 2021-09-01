test(function foo__2() {
    foo__2 = function foo__3(x__3) {
        return x__3 === 0 ? 1 : 1 + foo__3(x__3 - 1);
    };
    return foo__2(10);
});
