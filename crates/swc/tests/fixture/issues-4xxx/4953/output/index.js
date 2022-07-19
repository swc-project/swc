"use strict";
function a(a, b) {
    "use strict";
    !function(a, c) {
        c(b);
    }(void 0, function(a) {
        "use strict";
        a.vr = function(a, b, c) {
            return function() {
                return '123';
            };
        };
    });
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "default", {
    enumerable: !0,
    get: ()=>a
});
