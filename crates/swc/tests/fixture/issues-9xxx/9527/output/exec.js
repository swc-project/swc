import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
;
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            x: {
                break x;
                _this = _call_super(this, _class);
            }
            return _assert_this_initialized(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            try {} catch (unused) {
                _this = _call_super(this, _class);
            }
            return _assert_this_initialized(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            try {
                throw 0;
                _this = _call_super(this, _class);
            } catch (unused) {}
            return _assert_this_initialized(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            true || (_this = _call_super(this, _class));
            return _assert_this_initialized(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            var _ref;
            (_ref = {}) !== null && _ref !== void 0 ? _ref : _this = _call_super(this, _class);
            return _assert_this_initialized(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            false && (_this = _call_super(this, _class));
            return _assert_this_initialized(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            var _this1;
            (_this1 = null) === null || _this1 === void 0 ? void 0 : _this1(_this = _call_super(this, _class));
            return _assert_this_initialized(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(_class, Base);
        function _class() {
            _class_call_check(this, _class);
            var _this;
            var _this1;
            (_this1 = null) === null || _this1 === void 0 ? void 0 : _this1[_this = _call_super(this, _class)];
            return _assert_this_initialized(_this);
        }
        return _class;
    }(Base));
}).toThrow();
