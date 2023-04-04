//// [initializerReferencingConstructorParameters.ts]
// Initializer expressions for instance member variables are evaluated in the scope of the class constructor body but are not permitted to reference parameters or local variables of the constructor. 
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C(x1) {
    "use strict";
    _class_call_check(this, C);
    this.a = x // error
    ;
};
var D = function D(x1) {
    "use strict";
    _class_call_check(this, D);
    this.x = x1;
    this.a = x;
};
var E = function E(x1) {
    "use strict";
    _class_call_check(this, E);
    this.x = x1;
    this.a = this.x;
};
var F = function F(x1) {
    "use strict";
    _class_call_check(this, F);
    this.x = x1;
    this.a = this.x;
    this.b = x;
};
