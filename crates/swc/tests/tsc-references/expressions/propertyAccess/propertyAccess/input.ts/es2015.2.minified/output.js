(Compass = Compass1 || (Compass1 = {
}))[Compass.North = 0] = "North", Compass[Compass.South = 1] = "South", Compass[Compass.East = 2] = "East", Compass[Compass.West = 3] = "West";
var Compass, Compass1, bothIndex, stringOrNumber, someObject, numIndex = {
    3: "three",
    three: "three"
}, strIndex = {
    N: Compass1.North,
    E: Compass1.East
};
function noIndex() {
}
var obj = {
    10: "ten",
    x: "hello",
    y: 32,
    z: {
        n: "world",
        m: 15,
        o: ()=>!1
    },
    "literal property": 100
}, anyVar = {
};
obj.y = 4, anyVar.x = anyVar.y = obj.x = anyVar.z, obj.x, obj.hasOwnProperty, obj.qqq, obj["literal property"], obj["wa wa wa wa wa"], obj["10"], obj["1"], numIndex[3], numIndex[Compass1.South], numIndex[anyVar], numIndex.what, numIndex[someObject], strIndex.N, strIndex.zzz, strIndex[10], strIndex[Compass1.East], strIndex[null], noIndex[123], noIndex[Compass1.South], noIndex[null], noIndex[someObject], noIndex[32], bothIndex[Compass1.East], bothIndex[null], bothIndex.foo, bothIndex["1.0"], bothIndex[someObject], numIndex[stringOrNumber], strIndex[stringOrNumber], bothIndex[stringOrNumber];
