//// [propertyAccess.ts]
import "@swc/helpers/_/_call_super";
import "@swc/helpers/_/_class_call_check";
import "@swc/helpers/_/_inherits";
var Compass, Compass1 = ((Compass = Compass1 || {})[Compass.North = 0] = "North", Compass[Compass.South = 1] = "South", Compass[Compass.East = 2] = "East", Compass[Compass.West = 3] = "West", Compass), numIndex = {
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
obj.y = 4, anyVar.x = anyVar.y = obj.x = anyVar.z, obj.x, obj.hasOwnProperty, obj.qqq, obj['literal property'], obj['wa wa wa wa wa'], obj['10'], obj['1'], numIndex[3.0], numIndex[1], numIndex[anyVar], numIndex.what, numIndex[void 0], strIndex.N, strIndex.zzz, strIndex[10], strIndex[2], strIndex[null], noIndex[123], noIndex[1], noIndex[null], noIndex[void 0], noIndex[32], (void 0)[2], (void 0)[null], (void 0).foo, (void 0)['1.0'], (void 0)[void 0], numIndex[void 0], strIndex[void 0], (void 0)[void 0];
