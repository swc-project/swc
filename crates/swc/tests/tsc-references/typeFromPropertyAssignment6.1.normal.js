//// [def.js]
class Outer {
}
//// [a.js]
Outer.Inner = class I {
    messages() {
        return [];
    }
};
/** @type {!Outer.Inner} */ Outer.i;
//// [b.js]
var msgs = Outer.i.messages();
/** @param {Outer.Inner} inner */ function x(inner) {}
