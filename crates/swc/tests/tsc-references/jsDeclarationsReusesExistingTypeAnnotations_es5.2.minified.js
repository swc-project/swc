import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
var С1 = function() {
    "use strict";
    _class_call_check(this, С1), this.p1 = void 0, this.p2 = void 0, this.p3 = null, this.p4 = null;
}, С2 = function() {
    "use strict";
    function С2() {
        _class_call_check(this, С2);
    }
    return _create_class(С2, [
        {
            key: "p1",
            get: function() {}
        },
        {
            key: "p2",
            get: function() {}
        },
        {
            key: "p3",
            get: function() {
                return null;
            }
        },
        {
            key: "p4",
            get: function() {
                return null;
            }
        }
    ]), С2;
}(), С3 = function() {
    "use strict";
    function С3() {
        _class_call_check(this, С3);
    }
    return _create_class(С3, [
        {
            key: "p1",
            get: function() {},
            set: function(value) {
                this.p1 = value;
            }
        },
        {
            key: "p2",
            get: function() {},
            set: function(value) {
                this.p2 = value;
            }
        },
        {
            key: "p3",
            get: function() {
                return null;
            },
            set: function(value) {
                this.p3 = value;
            }
        },
        {
            key: "p4",
            get: function() {
                return null;
            },
            set: function(value) {
                this.p4 = value;
            }
        }
    ]), С3;
}(), С4 = function() {
    "use strict";
    function С4() {
        _class_call_check(this, С4);
    }
    return _create_class(С4, [
        {
            key: "p1",
            set: function(value) {
                this.p1 = value;
            }
        },
        {
            key: "p2",
            set: function(value) {
                this.p2 = value;
            }
        },
        {
            key: "p3",
            set: function(value) {
                this.p3 = value;
            }
        },
        {
            key: "p4",
            set: function(value) {
                this.p4 = value;
            }
        }
    ]), С4;
}();
