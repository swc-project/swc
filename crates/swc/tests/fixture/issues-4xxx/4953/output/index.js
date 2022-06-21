"use strict";
function a(a, b) {
    "use strict";
    !function(a, c) {
        c(b);
    }(void 0, function(a) {
        "use strict";
        a.vr = function(a, b, c) {
            function d() {
                return '123';
            }
            return d;
        };
    });
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    get: ()=>a,
    enumerable: !0
});
