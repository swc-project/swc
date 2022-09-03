//// [def.js]
class Outer {
}
//// [a.js]
Outer.Inner = class {
    messages() {
        return [];
    }
}, Outer.i;
//// [b.js]
var msgs = Outer.i.messages();
function x(inner) {}
