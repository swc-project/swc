"use strict";
new // A heritage expression and computed keys use the `this` and `new.target` of
// the code around the class. In strict code, a function there is strict
// outside the class too. So these unused classes can be dropped.
function() {
    foo(this, new.target), foo(this, new.target), bar(function() {
        return this;
    });
}(), // `super` in a heritage expression or computed key also refers to the code
// around the class, here the method `m`.
(class extends Object {
    static m() {
        foo(super.x), foo(super.y);
    }
}).m();
