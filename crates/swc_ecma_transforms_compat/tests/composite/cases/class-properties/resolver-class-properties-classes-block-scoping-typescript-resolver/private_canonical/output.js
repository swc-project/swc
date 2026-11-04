var _x = /*#__PURE__*/ new WeakMap(), _y = /*#__PURE__*/ new WeakMap();
var Point = /*#__PURE__*/ function() {
    "use strict";
    function Point(x = 0, y = 0) {
        _class_call_check(this, Point);
        _class_private_field_init(this, _x, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _y, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _x, +x);
        _class_private_field_set(this, _y, +y);
    }
    _create_class(Point, [
        {
            key: "x",
            get: function() {
                return _class_private_field_get(this, _x);
            },
            set: function(value) {
                _class_private_field_set(this, _x, +value);
            }
        },
        {
            key: "y",
            get: function() {
                return _class_private_field_get(this, _y);
            },
            set: function(value) {
                _class_private_field_set(this, _y, +value);
            }
        },
        {
            key: "equals",
            value: function equals(p) {
                return _class_private_field_get(this, _x) === _class_private_field_get(p, _x) && _class_private_field_get(this, _y) === _class_private_field_get(p, _y);
            }
        },
        {
            key: "toString",
            value: function toString() {
                return `Point<${_class_private_field_get(this, _x)},${_class_private_field_get(this, _y)}>`;
            }
        }
    ]);
    return Point;
}();
