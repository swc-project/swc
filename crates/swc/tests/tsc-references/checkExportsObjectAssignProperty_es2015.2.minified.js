import "./";
Object.defineProperty(exports, "thing", {
    value: 42,
    writable: !0
}), Object.defineProperty(exports, "readonlyProp", {
    value: "Smith",
    writable: !1
}), Object.defineProperty(exports, "rwAccessors", {
    get: ()=>98122,
    set (_) {}
}), Object.defineProperty(exports, "readonlyAccessor", {
    get: ()=>21.75
}), Object.defineProperty(exports, "setonlyAccessor", {
    set (str) {
        this.rwAccessors = Number(str);
    }
}), Object.defineProperty(module.exports, "thing", {
    value: "yes",
    writable: !0
}), Object.defineProperty(module.exports, "readonlyProp", {
    value: "Smith",
    writable: !1
}), Object.defineProperty(module.exports, "rwAccessors", {
    get: ()=>98122,
    set (_) {}
}), Object.defineProperty(module.exports, "readonlyAccessor", {
    get: ()=>21.75
}), Object.defineProperty(module.exports, "setonlyAccessor", {
    set (str) {
        this.rwAccessors = Number(str);
    }
}), require("./mod1").thing, require("./mod2").thing;
let m1 = require("./mod1");
m1.thing, m1.readonlyProp, m1.rwAccessors, m1.readonlyAccessor, m1.setonlyAccessor, m1.thing = 10, m1.rwAccessors = 11, m1.setonlyAccessor = "yes", m1.readonlyProp = "name", m1.readonlyAccessor = 12, m1.thing = "no", m1.rwAccessors = "no", m1.setonlyAccessor = 0;
let m2 = require("./mod2");
m2.thing, m2.readonlyProp, m2.rwAccessors, m2.readonlyAccessor, m2.setonlyAccessor, m2.thing = "ok", m2.rwAccessors = 11, m2.setonlyAccessor = "yes", m2.readonlyProp = "name", m2.readonlyAccessor = 12, m2.thing = 0, m2.rwAccessors = "no", m2.setonlyAccessor = 0;
