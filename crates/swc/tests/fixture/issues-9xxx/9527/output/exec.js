var _assert_this_initialized = require("@swc/helpers/_/_assert_this_initialized");
var _call_super = require("@swc/helpers/_/_call_super");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _inherits = require("@swc/helpers/_/_inherits");
var Base = function Base() {
    "use strict";
    _class_call_check._(this, Base);
};
;
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits._(_class, Base);
        function _class() {
            _class_call_check._(this, _class);
            var _this;
            x: {
                break x;
                _this = _call_super._(this, _class);
            }
            return _assert_this_initialized._(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits._(_class, Base);
        function _class() {
            _class_call_check._(this, _class);
            var _this;
            try {} catch (e) {
                _this = _call_super._(this, _class);
            }
            return _assert_this_initialized._(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits._(_class, Base);
        function _class() {
            _class_call_check._(this, _class);
            var _this;
            try {
                throw 0;
                _this = _call_super._(this, _class);
            } catch (e) {}
            return _assert_this_initialized._(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits._(_class, Base);
        function _class() {
            _class_call_check._(this, _class);
            var _this;
            true || (_this = _call_super._(this, _class));
            return _assert_this_initialized._(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits._(_class, Base);
        function _class() {
            _class_call_check._(this, _class);
            var _this;
            var _ref;
            (_ref = {}) !== null && _ref !== void 0 ? _ref : _this = _call_super._(this, _class);
            return _assert_this_initialized._(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits._(_class, Base);
        function _class() {
            _class_call_check._(this, _class);
            var _this;
            false && (_this = _call_super._(this, _class));
            return _assert_this_initialized._(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits._(_class, Base);
        function _class() {
            _class_call_check._(this, _class);
            var _this;
            var _this1;
            (_this1 = null) === null || _this1 === void 0 ? void 0 : _this1(_this = _call_super._(this, _class));
            return _assert_this_initialized._(_this);
        }
        return _class;
    }(Base));
}).toThrow();
expect(function() {
    return new (/*#__PURE__*/ function(Base) {
        "use strict";
        _inherits._(_class, Base);
        function _class() {
            _class_call_check._(this, _class);
            var _this;
            var _this1;
            (_this1 = null) === null || _this1 === void 0 ? void 0 : _this1[_this = _call_super._(this, _class)];
            return _assert_this_initialized._(_this);
        }
        return _class;
    }(Base));
}).toThrow();
