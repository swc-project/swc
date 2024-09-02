let Point = /*#__PURE__*/ function() {
    "use strict";
    function Point() {
        _class_call_check(this, Point);
    }
    _create_class(Point, [
        {
            key: "getX",
            value: function getX() {
                expect(this.x).toBe(3); // C
            }
        }
    ]);
    return Point;
}();
let ColorPoint = /*#__PURE__*/ function(Point) {
    "use strict";
    _inherits(ColorPoint, Point);
    function ColorPoint() {
        _class_call_check(this, ColorPoint);
        var _this;
        _this = _call_super(this, ColorPoint);
        _this.x = 2;
        _set((_assert_this_initialized(_this), _get_prototype_of(ColorPoint.prototype)), "x", 3, _this, true);
        expect(_this.x).toBe(3); // A
        expect(_get((_assert_this_initialized(_this), _get_prototype_of(ColorPoint.prototype)), "x", _this)).toBeUndefined(); // B
        return _this;
    }
    _create_class(ColorPoint, [
        {
            key: "m",
            value: function m() {
                this.getX();
            }
        }
    ]);
    return ColorPoint;
}(Point);
const cp = new ColorPoint();
cp.m();
