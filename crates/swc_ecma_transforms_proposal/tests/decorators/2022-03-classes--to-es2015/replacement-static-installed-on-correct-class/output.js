var _initClass, _x, _m, _temp;
const dec = () => { };
let hasX, hasM;
let _Foo;
new (_x = /*#__PURE__*/new WeakMap(), _m = /*#__PURE__*/new WeakSet(), (_temp = class extends identity {
  constructor() {
    (super(_Foo), classPrivateMethodInitSpec(this, _m), classPrivateFieldInitSpec(this, _x, {
      writable: true,
      value: void 0
    }), defineProperty(this, "x", void 0)), (() => {
      hasX = o => _x.has(checkInRHS(o));
      hasM = o => _m.has(checkInRHS(o));
    })(), _initClass();
  }
}, (() => {
  class Foo {
    static m() { }
  }
  [_Foo, _initClass] = applyDecs2203R(Foo, [], [dec]).c;
})(), _temp))();
function _m2() { }
