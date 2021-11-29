var M;
(function(M) {
    class Foo {
        constructor(){
        }
    }
    M.Foo = Foo;
    let S;
    (function(S) {
        class Bar {
        }
        S.Bar = Bar;
    })(S || (S = {
    }));
    M.S = S;
})(M || (M = {
}));
(function(M) {
    // Emit M.Foo
    Foo, /*#__PURE__*/ React.createElement(Foo, null);
    let S;
    (function(S) {
        // Emit M.Foo
        Foo, /*#__PURE__*/ React.createElement(Foo, null);
        // Emit S.Bar
        Bar, /*#__PURE__*/ React.createElement(Bar, null);
    })(S || (S = {
    }));
    M.S = S;
})(M || (M = {
}));
(function(M) {
    // Emit M.S.Bar
    S.Bar, /*#__PURE__*/ React.createElement(S.Bar, null);
})(M || (M = {
}));
(function(M) {
    var M1 = 100;
    // Emit M_1.Foo
    Foo, /*#__PURE__*/ React.createElement(Foo, null);
})(M || (M = {
}));
