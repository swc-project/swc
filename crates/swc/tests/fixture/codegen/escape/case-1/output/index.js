"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function __export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
__export(exports, {
    default: function() {
        return _default;
    }
});
var _default = "\nvoid main() {\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n";
