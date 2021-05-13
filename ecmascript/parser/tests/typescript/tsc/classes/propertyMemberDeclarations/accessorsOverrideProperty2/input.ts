// @target: esnext
// @useDefineForClassFields: true
class Base {
  x = 1;
}

class Derived extends Base {
  get x() { return 2; } // should be an error
  set x(value) { console.log(`x was set to ${value}`); }
}

const obj = new Derived(); // nothing printed
console.log(obj.x); // 1
