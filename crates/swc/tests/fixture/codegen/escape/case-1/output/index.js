"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    get: function() {
        return _default;
    },
    enumerable: true
});
var _default = "\nvoid main() {\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n";
