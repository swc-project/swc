function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var M;
(function(M1) {
    var Foo = function Foo() {
        "use strict";
        _classCallCheck(this, Foo);
    };
    M1.Foo = Foo;
    var S1;
    (function(S) {
        var Bar = function Bar() {
            "use strict";
            _classCallCheck(this, Bar);
        };
        S.Bar = Bar;
    })(S1 || (S1 = {
    }));
    M1.S = S1;
})(M || (M = {
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
})(M || (M = {
}));
(function(M) {
    // Emit M.S.Bar
    S.Bar, /*#__PURE__*/ React.createElement(S.Bar, null);
})(M || (M = {
}));
(function(M) {
    var M2 = 100;
    // Emit M_1.Foo
    Foo, /*#__PURE__*/ React.createElement(Foo, null);
})(M || (M = {
}));
