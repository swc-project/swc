import "./";
function Person(name) {
    this.name = name;
}
Person.prototype.describe = function() {
    return "Person called " + this.name;
}, Object.defineProperty(Person.prototype, "thing", {
    value: 42,
    writable: !0
}), Object.defineProperty(Person.prototype, "readonlyProp", {
    value: "Smith",
    writable: !1
}), Object.defineProperty(Person.prototype, "rwAccessors", {
    get: ()=>98122,
    set (_) {}
}), Object.defineProperty(Person.prototype, "readonlyAccessor", {
    get: ()=>21.75
}), Object.defineProperty(Person.prototype, "setonlyAccessor", {
    set (str) {
        this.rwAccessors = Number(str);
    }
}), module.exports = Person;
let Person = require("./mod1"), m1 = new Person("Name");
m1.thing, m1.readonlyProp, m1.rwAccessors, m1.readonlyAccessor, m1.setonlyAccessor, m1.thing = 10, m1.rwAccessors = 11, m1.setonlyAccessor = "yes", m1.readonlyProp = "name", m1.readonlyAccessor = 12, m1.thing = "no", m1.rwAccessors = "no", m1.setonlyAccessor = 0;
