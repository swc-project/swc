class C extends C {}

class A extends B {}
class B extends A {}

class D extends (E) {}
class E extends (D) {}

let a = b;
let b = a;

let c = (d);
let d = (c);

let F = class extends G {};
let G = class extends F {};

var x = y;
var y = x;
