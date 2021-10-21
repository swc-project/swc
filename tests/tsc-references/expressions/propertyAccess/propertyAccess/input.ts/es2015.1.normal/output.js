class A {
}
class B extends A {
}
var Compass1;
(function(Compass) {
    Compass[Compass["North"] = 0] = "North";
    Compass[Compass["South"] = 1] = "South";
    Compass[Compass["East"] = 2] = "East";
    Compass[Compass["West"] = 3] = "West";
})(Compass1 || (Compass1 = {
}));
var numIndex = {
    3: 'three',
    'three': 'three'
};
var strIndex = {
    'N': Compass1.North,
    'E': Compass1.East
};
var bothIndex;
function noIndex() {
}
var obj = {
    10: 'ten',
    x: 'hello',
    y: 32,
    z: {
        n: 'world',
        m: 15,
        o: ()=>false
    },
    'literal property': 100
};
var anyVar = {
};
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
var hh = numIndex[3];
var hh;
// Bracket notation property access using enum value on type with numeric index signature
var ii = numIndex[Compass1.South];
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
var oo = strIndex[Compass1.East];
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
var ss = noIndex[Compass1.South];
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
var ww = bothIndex[Compass1.East];
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
