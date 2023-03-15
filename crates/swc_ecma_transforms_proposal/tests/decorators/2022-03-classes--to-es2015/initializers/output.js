var _initClass, _temp, _initClass2, _temp2;
const dec = () => { };
let _Foo;
new (_temp = class extends identity {
  constructor() {
    (super(_Foo), defineProperty(this, "field", 123)), _initClass();
  }
}, (() => {
  class Foo { }
  [_Foo, _initClass] = _applyDecs2203R(Foo, [], [dec]).c;
})(), _temp)();
let _Bar;
new (_temp2 = class extends identity {
  constructor() {
    (super(_Bar), defineProperty(this, "field", ((() => {
      this.otherField = 456;
    })(), 123))), _initClass2();
  }
}, (() => {
  class Bar extends _Foo { }
  [_Bar, _initClass2] = _applyDecs2203R(Bar, [], [dec]).c;
})(), _temp2)();
