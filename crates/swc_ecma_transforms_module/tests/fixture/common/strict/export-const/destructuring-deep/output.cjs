"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    baz: function() {
        return baz;
    },
    qux: function() {
        return qux;
    }
});
const { foo: { bar: [baz, qux]  }  } = {};
