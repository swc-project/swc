import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// call signatures in derived types must have the same or fewer optional parameters as the target for assignment
var ClassTypeParam;
(function(ClassTypeParam) {
    var Base = function Base() {
        "use strict";
        var _this = this;
        _class_call_check(this, Base);
        this.init = function() {
            _this.a = function() {
                return null;
            }; // ok, same T of required params
            _this.a = function(x) {
                return null;
            }; // ok, same T of required params
            _this.a = function(x) {
                return null;
            }; // error, too many required params
            _this.a2 = function() {
                return null;
            }; // ok, same T of required params
            _this.a2 = function(x) {
                return null;
            }; // ok, same T of required params
            _this.a2 = function(x) {
                return null;
            }; // ok, same number of params
            _this.a3 = function() {
                return null;
            }; // ok, fewer required params
            _this.a3 = function(x) {
                return null;
            }; // ok, fewer required params
            _this.a3 = function(x) {
                return null;
            }; // ok, same T of required params
            _this.a3 = function(x, y) {
                return null;
            }; // error, too many required params
            _this.a4 = function() {
                return null;
            }; // ok, fewer required params
            _this.a4 = function(x, y) {
                return null;
            }; // ok, fewer required params
            _this.a4 = function(x) {
                return null;
            }; // ok, same T of required params
            _this.a4 = function(x, y) {
                return null;
            }; // ok, same number of params
            _this.a5 = function() {
                return null;
            }; // ok, fewer required params
            _this.a5 = function(x, y) {
                return null;
            }; // ok, fewer required params
            _this.a5 = function(x) {
                return null;
            }; // ok, all present params match
            _this.a5 = function(x, y) {
                return null;
            }; // ok, same number of params
        };
    };
})(ClassTypeParam || (ClassTypeParam = {}));
var GenericSignaturesInvalid;
(function(GenericSignaturesInvalid) {
    var foo = function foo() {
        var b;
        var t;
        // all errors
        b.a = t.a;
        b.a = t.a2;
        b.a = t.a3;
        b.a = t.a4;
        b.a = t.a5;
        b.a2 = t.a;
        b.a2 = t.a2;
        b.a2 = t.a3;
        b.a2 = t.a4;
        b.a2 = t.a5;
        b.a3 = t.a;
        b.a3 = t.a2;
        b.a3 = t.a3;
        b.a3 = t.a4;
        b.a3 = t.a5;
        b.a4 = t.a;
        b.a4 = t.a2;
        b.a4 = t.a3;
        b.a4 = t.a4;
        b.a4 = t.a5;
        b.a5 = t.a;
        b.a5 = t.a2;
        b.a5 = t.a3;
        b.a5 = t.a4;
        b.a5 = t.a5;
    };
    var Base2 = function Base2() {
        "use strict";
        _class_call_check(this, Base2);
    };
    var Target = function Target() {
        "use strict";
        _class_call_check(this, Target);
    };
})(GenericSignaturesInvalid || (GenericSignaturesInvalid = {}));
var GenericSignaturesValid;
(function(GenericSignaturesValid) {
    var Base2 = function Base2() {
        "use strict";
        var _this = this;
        _class_call_check(this, Base2);
        this.init = function() {
            _this.a = function() {
                return null;
            }; // ok, same T of required params
            _this.a = function(x) {
                return null;
            }; // ok, same T of required params
            _this.a = function(x) {
                return null;
            }; // error, too many required params
            _this.a2 = function() {
                return null;
            }; // ok, same T of required params
            _this.a2 = function(x) {
                return null;
            }; // ok, same T of required params
            _this.a2 = function(x) {
                return null;
            }; // ok, same number of params
            _this.a3 = function() {
                return null;
            }; // ok, fewer required params
            _this.a3 = function(x) {
                return null;
            }; // ok, fewer required params
            _this.a3 = function(x) {
                return null;
            }; // ok, same T of required params
            _this.a3 = function(x, y) {
                return null;
            }; // error, too many required params
            _this.a4 = function() {
                return null;
            }; // ok, fewer required params
            _this.a4 = function(x, y) {
                return null;
            }; // ok, fewer required params
            _this.a4 = function(x) {
                return null;
            }; // ok, same T of required params
            _this.a4 = function(x, y) {
                return null;
            }; // ok, same number of params
            _this.a5 = function() {
                return null;
            }; // ok, fewer required params
            _this.a5 = function(x, y) {
                return null;
            }; // ok, fewer required params
            _this.a5 = function(x) {
                return null;
            }; // ok, all present params match
            _this.a5 = function(x, y) {
                return null;
            }; // ok, same number of params
        };
    };
})(GenericSignaturesValid || (GenericSignaturesValid = {}));
