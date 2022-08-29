//// [def.js]
//// [a.js]
Outer.Inner = class {
    messages() {
        return [];
    }
}, Outer.i;
//// [b.js]
Outer.i.messages();
