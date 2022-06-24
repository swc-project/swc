define([
    "require"
], function(require) {
    "use strict";
    class A {
        // this is weird I know
        [(()=>void 0)()] = 123;
    }
    class B {
        // this is weird too I know
        [(()=>void 0)()]() {}
    }
    class C {
        static [(()=>void 0)()] = 1;
    }
    class D {
        static d = class {
            [(()=>this)()]() {}
        };
    }
});
