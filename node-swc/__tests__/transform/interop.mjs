import swc from "../../..";

const source = `import foo from "foo";
import bar, { baz } from "bar";

export const x = { foo, bar };
export const y = baz;
export default {
    x,
    y,
};
`;

it("should support importInterop: swc", async () => {
    const { code } = await swc.transform(source, {
        jsc: {
            parser: {
                syntax: "ecmascript",
            },
            target: "es2020",
        },
        module: {
            type: "commonjs",
            importInterop: "swc",
        },
    });
    expect(code).toMatchInlineSnapshot(`
"\\"use strict\\";
Object.defineProperty(exports, \\"__esModule\\", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    default: ()=>_default,
    x: ()=>x,
    y: ()=>y
});
const _foo = _interopRequireDefault(require(\\"foo\\"));
const _bar = _interopRequireWildcard(require(\\"bar\\"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== \\"function\\") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== \\"object\\" && typeof obj !== \\"function\\") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== \\"default\\" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const x = {
    foo: _foo.default,
    bar: _bar.default
};
const y = _bar.baz;
var _default = {
    x,
    y
};
"
`);
});

it("should support importInterop: babel", async () => {
    const { code } = await swc.transform(source, {
        jsc: {
            parser: {
                syntax: "ecmascript",
            },
            target: "es2020",
        },
        module: {
            type: "commonjs",
            importInterop: "babel",
        },
    });
    expect(code).toMatchInlineSnapshot(`
"\\"use strict\\";
Object.defineProperty(exports, \\"__esModule\\", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    default: ()=>_default,
    x: ()=>x,
    y: ()=>y
});
const _foo = _interopRequireDefault(require(\\"foo\\"));
const _bar = _interopRequireWildcard(require(\\"bar\\"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== \\"function\\") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== \\"object\\" && typeof obj !== \\"function\\") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== \\"default\\" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const x = {
    foo: _foo.default,
    bar: _bar.default
};
const y = _bar.baz;
var _default = {
    x,
    y
};
"
`);
});

it("should support importInterop: node", async () => {
    const { code } = await swc.transform(source, {
        jsc: {
            parser: {
                syntax: "ecmascript",
            },
            target: "es2020",
        },
        module: {
            type: "commonjs",
            importInterop: "node",
        },
    });
    expect(code).toMatchInlineSnapshot(`
"\\"use strict\\";
Object.defineProperty(exports, \\"__esModule\\", {
    value: true
});
exports.y = exports.x = exports.default = void 0;
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    default: ()=>_default,
    x: ()=>x,
    y: ()=>y
});
const _foo = require(\\"foo\\");
const _bar = _interopRequireWildcard(require(\\"bar\\"), true);
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== \\"function\\") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== \\"object\\" && typeof obj !== \\"function\\") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== \\"default\\" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
const x = {
    foo: _foo,
    bar: _bar.default
};
const y = _bar.baz;
var _default = {
    x,
    y
};
"
`);
});

it("should support importInterop: none", async () => {
    const { code } = await swc.transform(source, {
        jsc: {
            parser: {
                syntax: "ecmascript",
            },
            target: "es2020",
        },
        module: {
            type: "commonjs",
            importInterop: "none",
        },
    });
    expect(code).toMatchInlineSnapshot(`
"\\"use strict\\";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    default: ()=>_default,
    x: ()=>x,
    y: ()=>y
});
const _foo = require(\\"foo\\");
const _bar = require(\\"bar\\");
const x = {
    foo: _foo.default,
    bar: _bar.default
};
const y = _bar.baz;
var _default = {
    x,
    y
};
"
`);
});
