import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var M;
(function(M) {
    var Foo1 = function Foo1() {
        "use strict";
        _class_call_check(this, Foo1);
    };
    M.Foo = Foo1;
    var S1;
    (function(S1) {
        var Bar1 = function Bar1() {
            "use strict";
            _class_call_check(this, Bar1);
        };
        S1.Bar = Bar1;
    })(S1 = M.S || (M.S = {}));
})(M || (M = {}));
(function(M) {
    // Emit M.Foo
    Foo, /*#__PURE__*/ React.createElement(Foo, null);
    var S1;
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
