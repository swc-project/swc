var M;
(function(M) {
    class Foo1 {
        constructor(){}
    }
    M.Foo = Foo1;
    let S1;
    (function(S1) {
        class Bar1 {
        }
        S1.Bar = Bar1;
    })(S1 = M.S || (M.S = {}));
})(M || (M = {}));
(function(M) {
    // Emit M.Foo
    Foo, /*#__PURE__*/ React.createElement(Foo, null);
    let S1;
    (function(S1) {
        // Emit M.Foo
        Foo, /*#__PURE__*/ React.createElement(Foo, null);
        // Emit S.Bar
        Bar, /*#__PURE__*/ React.createElement(Bar, null);
    })(S1 = M.S || (M.S = {}));
})(M || (M = {}));
(function(M) {
    // Emit M.S.Bar
    S.Bar, /*#__PURE__*/ React.createElement(S.Bar, null);
})(M || (M = {}));
(function(M) {
    var M1 = 100;
    // Emit M_1.Foo
    Foo, /*#__PURE__*/ React.createElement(Foo, null);
})(M || (M = {}));
