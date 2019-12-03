"use strict";

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

let Base = function Base() {};

let Obj =
/*#__PURE__*/
function (_Base) {
  _inheritsLoose(Obj, _Base);

  function Obj() {
    return _Base.apply(this, arguments) || this;
  }

  var _proto = Obj.prototype;

  _proto.get = function get() {
    return _Base.prototype.test;
  };

  return Obj;
}(Base);

Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true
});
const obj = new Obj();
expect(obj.test).toBe(2);
expect(obj.get()).toBeUndefined();
