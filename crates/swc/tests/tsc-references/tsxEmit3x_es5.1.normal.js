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
    })(S1 = M1.S || (M1.S = {}));
})(M || (M = {}));
(function(M2) {
    // Emit M.Foo
    Foo, /*#__PURE__*/ React.createElement(Foo, null);
    var S;
    (function(S) {
        // Emit M.Foo
        Foo, /*#__PURE__*/ React.createElement(Foo, null);
        // Emit S.Bar
        Bar, /*#__PURE__*/ React.createElement(Bar, null);
    })(S = M2.S || (M2.S = {}));
})(M || (M = {}));
(function(M) {
    // Emit M.S.Bar
    S.Bar, /*#__PURE__*/ React.createElement(S.Bar, null);
})(M || (M = {}));
(function(M3) {
    var M = 100;
    // Emit M_1.Foo
    Foo, /*#__PURE__*/ React.createElement(Foo, null);
})(M || (M = {}));
