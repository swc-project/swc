"use strict";

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

let value = 1;

let Base =
/*#__PURE__*/
function () {
  function Base() {}

  _createClass(Base, [{
    key: "test",
    set: function (v) {
      value = v;
    }
  }]);

  return Base;
}();

let Obj =
/*#__PURE__*/
function (_Base) {
  _inheritsLoose(Obj, _Base);

  function Obj() {
    return _Base.apply(this, arguments) || this;
  }

  var _proto = Obj.prototype;

  _proto.set = function set() {
    return this.test = 3;
  };

  return Obj;
}(Base);

Object.defineProperty(Obj.prototype, 'test', {
  value: 2,
  writable: true,
  configurable: true
});
const obj = new Obj();
expect(obj.set()).toBe(3); // This is incorrect according to the spec,
// but close enough for loose.
// expect(value).toBe(3);

expect(value).toBe(1);
expect(Base.prototype.test).toBeUndefined();
expect(Obj.prototype.test).toBe(2); // This is incorrect according to the spec,
// but close enough for loose.
// expect(obj.test).toBe(2);

expect(obj.test).toBe(3);
