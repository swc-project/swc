//// [file.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(M) {
    var Foo = function Foo() {
        "use strict";
        _class_call_check(this, Foo);
    };
    M.Foo = Foo;
    (function(S) {
        var Bar = function Bar() {
            "use strict";
            _class_call_check(this, Bar);
        };
        S.Bar = Bar;
    // Emit Foo
    // Foo, <Foo />;
    })(M.S || (M.S = {}));
})(M || (M = {}));
(function(M) {
    // Emit M.Foo
    M.Foo, /*#__PURE__*/ React.createElement(M.Foo, null);
    (function(S) {
        // Emit M.Foo
        M.Foo, /*#__PURE__*/ React.createElement(M.Foo, null);
        // Emit S.Bar
        S.Bar, /*#__PURE__*/ React.createElement(S.Bar, null);
    })(M.S || (M.S = {}));
})(M || (M = {}));
(function(M) {
    // Emit M.S.Bar
    M.S.Bar, /*#__PURE__*/ React.createElement(M.S.Bar, null);
})(M || (M = {}));
(function(M) {
    var M1 = 100;
    // Emit M_1.Foo
    M.Foo, /*#__PURE__*/ React.createElement(M.Foo, null);
})(M || (M = {}));
var M;
