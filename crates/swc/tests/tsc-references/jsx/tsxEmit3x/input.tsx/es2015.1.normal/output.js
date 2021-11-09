var M1;
(function(M) {
    class Foo {
        constructor(){
        }
    }
    M.Foo = Foo;
    var S1;
    (function(S) {
        class Bar {
        }
        S.Bar = Bar;
    })(S1 || (S1 = {
    }));
    M.S = S1;
})(M1 || (M1 = {
}));
(function(M) {
    // Emit M.Foo
    Foo, /*#__PURE__*/ React.createElement(Foo, null);
    (function(S) {
        // Emit M.Foo
        Foo, /*#__PURE__*/ React.createElement(Foo, null);
        // Emit S.Bar
        Bar, /*#__PURE__*/ React.createElement(Bar, null);
    })(S || (S = {
    }));
})(M1 || (M1 = {
}));
(function(M) {
    // Emit M.S.Bar
    S.Bar, /*#__PURE__*/ React.createElement(S.Bar, null);
})(M1 || (M1 = {
}));
(function(M) {
    var M2 = 100;
    // Emit M_1.Foo
    Foo, /*#__PURE__*/ React.createElement(Foo, null);
})(M1 || (M1 = {
}));
