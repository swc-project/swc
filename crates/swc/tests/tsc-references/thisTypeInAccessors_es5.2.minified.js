import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
var Explicit = function() {
    "use strict";
    function Explicit() {
        _class_call_check(this, Explicit), this.n = 17;
    }
    return _create_class(Explicit, [
        {
            key: "x",
            get: function() {
                return this.n;
            },
            set: function(n) {
                this.n = n;
            }
        }
    ]), Explicit;
}(), Contextual = function() {
    "use strict";
    function Contextual() {
        _class_call_check(this, Contextual), this.n = 21;
    }
    return _create_class(Contextual, [
        {
            key: "x",
            get: function() {
                return this.n;
            }
        }
    ]), Contextual;
}();
