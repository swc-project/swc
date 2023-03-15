var _initClass, _temp;
const dec = () => { };
let _Foo;
new (_temp = class extends identity {
  constructor() {
    (super(_Foo), defineProperty(this, "foo", new _Foo())), _initClass();
  }
}, (() => {
  class Foo { }
  [_Foo, _initClass] = applyDecs2203R(Foo, [], [dec]).c;
})(), _temp)();
const foo = new _Foo();
