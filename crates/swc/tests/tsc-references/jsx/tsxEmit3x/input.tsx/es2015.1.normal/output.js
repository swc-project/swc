var M;
(function(M1) {
    class Foo {
        constructor(){
        }
    }
    M1.Foo = Foo;
    let S1;
    (function(S) {
        class Bar {
        }
        S.Bar = Bar;
    })(S1 = M1.S || (M1.S = {
    }));
})(M || (M = {
}));
(function(M2) {
    // Emit M.Foo
    Foo, /*#__PURE__*/ React.createElement(Foo, null);
    let S;
    (function(S) {
        // Emit M.Foo
        Foo, /*#__PURE__*/ React.createElement(Foo, null);
        // Emit S.Bar
        Bar, /*#__PURE__*/ React.createElement(Bar, null);
    })(S = M2.S || (M2.S = {
    }));
})(M || (M = {
}));
(function(M) {
    // Emit M.S.Bar
    S.Bar, /*#__PURE__*/ React.createElement(S.Bar, null);
})(M || (M = {
}));
(function(M) {
    var M3 = 100;
    // Emit M_1.Foo
    Foo, /*#__PURE__*/ React.createElement(Foo, null);
})(M || (M = {
}));
