//// [file.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(M) {
    var Foo1 = function Foo1() {
        "use strict";
        _class_call_check(this, Foo1);
    };
    M.Foo = Foo1;
    (function(S1) {
        var Bar1 = function Bar1() {
            "use strict";
            _class_call_check(this, Bar1);
        };
        S1.Bar = Bar1;
    // Emit Foo
    // Foo, <Foo />;
    })(M.S || (M.S = {}));
})(M || (M = {}));
(function(M) {
    // Emit M.Foo
    Foo, <Foo/>;
    (function(S1) {
        // Emit M.Foo
        Foo, <Foo/>;
        // Emit S.Bar
        Bar, <Bar/>;
    })(M.S || (M.S = {}));
})(M || (M = {}));
(function(M) {
    // Emit M.S.Bar
    S.Bar, <S.Bar/>;
})(M || (M = {}));
(function(M) {
    var M1 = 100;
    // Emit M_1.Foo
    Foo, <Foo/>;
})(M || (M = {}));
var M;
