test(function foo__2() {
    foo__2 = function foo__3(x__4) {
        return x__4 === 0 ? 1 : 1 + foo__3(x__4 - 1);
    };
    return foo__2(10);
});
