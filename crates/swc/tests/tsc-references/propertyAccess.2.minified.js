//// [propertyAccess.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
!function(Compass) {
    Compass[Compass.North = 0] = "North", Compass[Compass.South = 1] = "South", Compass[Compass.East = 2] = "East", Compass[Compass.West = 3] = "West";
}(Compass || (Compass = {}));
var Compass, bothIndex, stringOrNumber, someObject, numIndex = {
    3: "three",
    three: "three"
}, strIndex = {
    N: Compass.North,
    E: Compass.East
};
function noIndex() {}
var obj = {
    10: "ten",
    x: "hello",
    y: 32,
    z: {
        n: "world",
        m: 15,
        o: function() {
            return !1;
        }
    },
    "literal property": 100
}, anyVar = {};
obj.y = 4, anyVar.x = anyVar.y = obj.x = anyVar.z, obj.x, obj.hasOwnProperty, obj.qqq, obj["literal property"], obj["wa wa wa wa wa"], obj["10"], obj["1"], numIndex[3.0], numIndex[Compass.South], numIndex[anyVar], numIndex.what, numIndex[someObject], strIndex.N, strIndex.zzz, strIndex[10], strIndex[Compass.East], strIndex[null], noIndex[123], noIndex[Compass.South], noIndex[null], noIndex[someObject], noIndex[32], bothIndex[Compass.East], bothIndex[null], bothIndex.foo, bothIndex["1.0"], bothIndex[someObject], numIndex[stringOrNumber], strIndex[stringOrNumber], bothIndex[stringOrNumber];
