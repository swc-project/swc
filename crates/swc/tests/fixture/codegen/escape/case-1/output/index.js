"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _default = "\nvoid main() {\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n";
