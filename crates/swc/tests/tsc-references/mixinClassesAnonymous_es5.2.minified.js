import * as swcHelpers from "@swc/helpers";
var _class, Base = function(x, y) {
    swcHelpers.classCallCheck(this, Base), this.x = x, this.y = y;
}, Derived = function(Base1) {
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(x, y, z) {
        var _this;
        return swcHelpers.classCallCheck(this, Derived), (_this = _super.call(this, x, y)).z = z, _this;
    }
    return Derived;
}(Base);
function Tagged(superClass1) {
    var C = function(superClass) {
        swcHelpers.inherits(C, superClass);
        var _super = swcHelpers.createSuper(C);
        function C() {
            for(var _this, _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++)args[_key] = arguments[_key];
            return swcHelpers.classCallCheck(this, C), (_this = _super.call.apply(_super, [
                this
            ].concat(swcHelpers.toConsumableArray(args))))._tag = "hello", _this;
        }
        return C;
    }(superClass1);
    return C;
}
Tagged(Derived);
var Thing2 = Tagged(((_class = function(superClass) {
    swcHelpers.inherits(_class, superClass);
    var _super = swcHelpers.createSuper(_class);
    function _class() {
        return swcHelpers.classCallCheck(this, _class), _super.apply(this, arguments);
    }
    return _class.prototype.print = function() {
        this.x, this.y;
    }, _class;
}(Derived)).message = "hello", _class));
Thing2.message;
var Thing3 = function(Thing21) {
    swcHelpers.inherits(Thing3, Thing21);
    var _super = swcHelpers.createSuper(Thing3);
    function Thing3(tag) {
        var _this;
        return swcHelpers.classCallCheck(this, Thing3), (_this = _super.call(this, 10, 20, 30))._tag = tag, _this;
    }
    return Thing3.prototype.test = function() {
        this.print();
    }, Thing3;
}(Thing2);
