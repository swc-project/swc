var _initClass;
const dec = () => { };
let _Foo;
new class extends identity {
  static {
    class Foo {
      static {
        [_Foo, _initClass] = applyDecs2203R(this, [], [dec]).c;
      }
    }
  }
  foo = new _Foo();
  constructor() {
    super(_Foo), _initClass();
  }
}();
const foo = new _Foo();
