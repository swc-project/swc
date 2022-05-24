import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _possible_constructor_return from "@swc/helpers/lib/_possible_constructor_return.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function() {
    "use strict";
    _class_call_check(this, Base);
}, Derived = function(Base1) {
    "use strict";
    function Derived() {
        var _this;
        return _class_call_check(this, Derived), _possible_constructor_return(_this);
    }
    return _inherits(Derived, Base1), _create_super(Derived), Derived;
}(Base), Base2 = function() {
    "use strict";
    _class_call_check(this, Base2);
}, Derived2 = function(Base21) {
    "use strict";
    function Derived2() {
        var _this;
        return _class_call_check(this, Derived2), _possible_constructor_return(_this);
    }
    return _inherits(Derived2, Base21), _create_super(Derived2), Derived2;
}(Base2), Derived3 = function(Base22) {
    "use strict";
    function Derived3() {
        return _class_call_check(this, Derived3), _possible_constructor_return(void 0);
    }
    return _inherits(Derived3, Base22), _create_super(Derived3), Derived3;
}(Base2), Derived4 = function(Base23) {
    "use strict";
    _inherits(Derived4, Base23);
    var _super = _create_super(Derived4);
    function Derived4() {
        return _class_call_check(this, Derived4), _possible_constructor_return(_super.call(this));
    }
    return Derived4;
}(Base2);
