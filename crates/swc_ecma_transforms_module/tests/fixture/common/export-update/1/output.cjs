"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        get: all[name],
        enumerable: true
    });
}
_export(exports, {
    bar: ()=>bar,
    baz: ()=>baz,
    bazbar: ()=>baz,
    foo: ()=>foo,
    foobar: ()=>foo
});
let foo = 1n;
foo++;
let bar = ++foo;
let baz = bar--;
--bar;
