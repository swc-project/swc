//// [propertyAccess.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var bothIndex, stringOrNumber, someObject, Compass, Compass1 = ((Compass = Compass1 || {})[Compass.North = 0] = "North", Compass[Compass.South = 1] = "South", Compass[Compass.East = 2] = "East", Compass[Compass.West = 3] = "West", Compass), numIndex = {
    3: 'three',
    three: 'three'
}, strIndex = {
    N: 0,
    E: 2
};
function noIndex() {}
var obj = {
    10: 'ten',
    x: 'hello',
    y: 32,
    z: {
        n: 'world',
        m: 15,
        o: function() {
            return !1;
        }
    },
    'literal property': 100
}, anyVar = {};
obj.y = 4, anyVar.x = anyVar.y = obj.x = anyVar.z, obj.x, obj.hasOwnProperty, obj.qqq, obj['literal property'], obj['wa wa wa wa wa'], obj['10'], obj['1'], numIndex[3.0], numIndex[1], numIndex[anyVar], numIndex.what, numIndex[someObject], strIndex.N, strIndex.zzz, strIndex[10], strIndex[2], strIndex[null], noIndex[123], noIndex[1], noIndex[null], noIndex[someObject], noIndex[32], bothIndex[2], bothIndex[null], bothIndex.foo, bothIndex['1.0'], bothIndex[someObject], numIndex[stringOrNumber], strIndex[stringOrNumber], bothIndex[stringOrNumber];
