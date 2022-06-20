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
}), !function(a, b) {
    for(var c in b)Object.defineProperty(a, c, {
        get: b[c],
        enumerable: !0
    });
}(exports, {
    default: ()=>a
});
