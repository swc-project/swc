//// [exportsAndImportsWithUnderscores4.ts]
//// [m1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    get _ () {
        return _;
    },
    get __ () {
        return __;
    },
    get ___ () {
        return ___;
    },
    get ___hello () {
        return ___hello;
    },
    get __esmodule () {
        return __esmodule;
    },
    get __proto () {
        return __proto;
    },
    get _hi () {
        return _hi;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
function _() {
    console.log("_");
}
function __() {
    console.log("__");
}
function ___() {
    console.log("___");
}
function _hi() {
    console.log("_hi");
}
function __proto() {
    console.log("__proto");
}
function __esmodule() {
    console.log("__esmodule");
}
function ___hello() {
    console.log("___hello");
}
//// [m2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _m1 = require("./m1");
(0, _m1._)(), (0, _m1.__)(), (0, _m1.___hello)(), (0, _m1.__esmodule)(), (0, _m1.__proto)(), (0, _m1._hi)();
