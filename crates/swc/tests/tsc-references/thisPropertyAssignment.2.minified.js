//// [a.js]
// This test is asserting that a single property/element access
// on `this` is a special assignment declaration, but chaining
// off that does not create additional declarations. I’m not sure
// if it needs to be that way in JavaScript; the test simply
// ensures no accidental changes were introduced while allowing
// element access assignments to create declarations.
this.x = {}, this.x.y = {}, this.y = {}, this.y.z = {};
var f = new /** @constructor */ function() {
    this.a = {}, this.a.b = {}, this.b = {}, this.b.c = {};
}();
f.a, f.b;
