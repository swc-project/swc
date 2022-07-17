// @allowJs: true
// @noEmit: true
// @strict: true
// @checkJs: true
// @filename: mod1.js
/**
 * @constructor
 * @param {string} name
 */ // @filename: validator.ts
import "./";
function Person(name) {
    this.name = name;
}
Person.prototype.describe = function() {
    return "Person called " + this.name;
};
Object.defineProperty(Person.prototype, "thing", {
    value: 42,
    writable: true
});
Object.defineProperty(Person.prototype, "readonlyProp", {
    value: "Smith",
    writable: false
});
Object.defineProperty(Person.prototype, "rwAccessors", {
    get: function get() {
        return 98122;
    },
    set: function set(_) {}
});
Object.defineProperty(Person.prototype, "readonlyAccessor", {
    get: function get() {
        return 21.75;
    }
});
Object.defineProperty(Person.prototype, "setonlyAccessor", {
    /** @param {string} str */ set: function set(str) {
        this.rwAccessors = Number(str);
    }
});
module.exports = Person;
var Person = require("./mod1");
var m1 = new Person("Name");
m1.thing;
m1.readonlyProp;
m1.rwAccessors;
m1.readonlyAccessor;
m1.setonlyAccessor;
// allowed assignments
m1.thing = 10;
m1.rwAccessors = 11;
m1.setonlyAccessor = "yes";
// disallowed assignments
m1.readonlyProp = "name";
m1.readonlyAccessor = 12;
m1.thing = "no";
m1.rwAccessors = "no";
m1.setonlyAccessor = 0;
