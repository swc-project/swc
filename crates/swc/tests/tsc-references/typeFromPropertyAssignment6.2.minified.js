//// [def.js]
//// [a.js]
Outer.Inner = class {
    messages() {
        return [];
    }
}, /** @type {!Outer.Inner} */ Outer.i;
//// [b.js]
Outer.i.messages();
