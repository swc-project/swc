(Compass1 = Compass2 || (Compass2 = {
}))[Compass1.North = 0] = "North", Compass1[Compass1.South = 1] = "South", Compass1[Compass1.East = 2] = "East", Compass1[Compass1.West = 3] = "West";
var Compass1, Compass2, bothIndex, stringOrNumber, someObject, numIndex = {
    3: "three",
    three: "three"
}, strIndex = {
    N: Compass2.North,
    E: Compass2.East
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
obj.y = 4, anyVar.x = anyVar.y = obj.x = anyVar.z, obj.x, obj.hasOwnProperty, obj.qqq, obj["literal property"], obj["wa wa wa wa wa"], obj["10"], obj["1"], numIndex[3], numIndex[Compass2.South], numIndex[anyVar], numIndex.what, numIndex[someObject], strIndex.N, strIndex.zzz, strIndex[10], strIndex[Compass2.East], strIndex[null], noIndex[123], noIndex[Compass2.South], noIndex[null], noIndex[someObject], noIndex[32], bothIndex[Compass2.East], bothIndex[null], bothIndex.foo, bothIndex["1.0"], bothIndex[someObject], numIndex[stringOrNumber], strIndex[stringOrNumber], bothIndex[stringOrNumber];
