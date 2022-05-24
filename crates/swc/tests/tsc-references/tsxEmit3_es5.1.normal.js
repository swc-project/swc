import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var M;
(function(M1) {
    var Foo = function Foo() {
        "use strict";
        _class_call_check(this, Foo);
    };
    M1.Foo = Foo;
    var S1;
    (function(S) {
        var Bar = function Bar() {
            "use strict";
            _class_call_check(this, Bar);
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
(function(M) {
    var M3 = 100;
    // Emit M_1.Foo
    Foo, /*#__PURE__*/ React.createElement(Foo, null);
})(M || (M = {}));
