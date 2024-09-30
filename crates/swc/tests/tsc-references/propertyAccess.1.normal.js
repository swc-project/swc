//// [propertyAccess.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        _class_call_check(this, B);
        return _call_super(this, B, arguments);
    }
    return B;
}(A);
var Compass = /*#__PURE__*/ function(Compass) {
    Compass[Compass["North"] = 0] = "North";
    Compass[Compass["South"] = 1] = "South";
    Compass[Compass["East"] = 2] = "East";
    Compass[Compass["West"] = 3] = "West";
    return Compass;
}(Compass || {});
var numIndex = {
    3: 'three',
    'three': 'three'
};
var strIndex = {
    'N': 0,
    'E': 2
};
var bothIndex;
function noIndex() {}
var obj = {
    10: 'ten',
    x: 'hello',
    y: 32,
    z: {
        n: 'world',
        m: 15,
        o: function() {
            return false;
        }
    },
    'literal property': 100
};
var anyVar = {};
var stringOrNumber;
var someObject;
// Assign to a property access
obj.y = 4;
// Property access on value of type 'any'
anyVar.x = anyVar.y = obj.x = anyVar.z;
// Dotted property access of property that exists
var aa = obj.x;
// Dotted property access of property that exists on value's apparent type
var bb = obj.hasOwnProperty;
// Dotted property access of property that doesn't exist on value's apparent type
var cc = obj.qqq; // error
// Bracket notation property access using string literal value on type with property of that literal name
var dd = obj['literal property'];
var dd;
// Bracket notation property access using string literal value on type without property of that literal name
var ee = obj['wa wa wa wa wa'];
var ee;
// Bracket notation property access using numeric string literal value on type with property of that literal name
var ff = obj['10'];
var ff;
// Bracket notation property access using numeric string literal value on type without property of that literal name
var gg = obj['1'];
var gg;
// Bracket notation property access using numeric value on type with numeric index signature
var hh = numIndex[3.0];
var hh;
// Bracket notation property access using enum value on type with numeric index signature
var ii = numIndex[1];
var ii;
// Bracket notation property access using value of type 'any' on type with numeric index signature
var jj = numIndex[anyVar];
var jj;
// Bracket notation property access using string value on type with numeric index signature
var kk = numIndex['what'];
var kk;
// Bracket notation property access using value of other type on type with numeric index signature and no string index signature
var ll = numIndex[someObject]; // Error
// Bracket notation property access using string value on type with string index signature and no numeric index signature
var mm = strIndex['N'];
var mm;
var mm2 = strIndex['zzz'];
var mm2;
// Bracket notation property access using numeric value on type with string index signature and no numeric index signature
var nn = strIndex[10];
var nn;
// Bracket notation property access using enum value on type with string index signature and no numeric index signature
var oo = strIndex[2];
var oo;
// Bracket notation property access using value of type 'any' on type with string index signature and no numeric index signature
var pp = strIndex[null];
var pp;
// Bracket notation property access using numeric value on type with no index signatures
var qq = noIndex[123];
var qq;
// Bracket notation property access using string value on type with no index signatures
var rr = noIndex['zzzz'];
var rr;
// Bracket notation property access using enum value on type with no index signatures
var ss = noIndex[1];
var ss;
// Bracket notation property access using value of type 'any' on type with no index signatures
var tt = noIndex[null];
var tt;
// Bracket notation property access using values of other types on type with no index signatures
var uu = noIndex[someObject]; // Error
// Bracket notation property access using numeric value on type with numeric index signature and string index signature
var vv = noIndex[32];
var vv;
// Bracket notation property access using enum value on type with numeric index signature and string index signature
var ww = bothIndex[2];
var ww;
// Bracket notation property access using value of type 'any' on type with numeric index signature and string index signature
var xx = bothIndex[null];
var xx;
// Bracket notation property access using string value on type with numeric index signature and string index signature
var yy = bothIndex['foo'];
var yy;
// Bracket notation property access using numeric string value on type with numeric index signature and string index signature
var zz = bothIndex['1.0'];
var zz;
// Bracket notation property access using value of other type on type with numeric index signature and no string index signature and string index signature
var zzzz = bothIndex[someObject]; // Error
var x1 = numIndex[stringOrNumber];
var x1;
var x2 = strIndex[stringOrNumber];
var x2;
var x3 = bothIndex[stringOrNumber];
var x3;
