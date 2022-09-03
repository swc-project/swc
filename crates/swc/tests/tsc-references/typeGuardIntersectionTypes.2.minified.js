//// [typeGuardIntersectionTypes.ts]
function f1(obj) {
    isX(obj) || isY(obj) || isZ(obj), isX(obj) && isY(obj) && isZ(obj);
}
function isB(toTest) {
    return toTest && toTest.b;
}
function union(a) {
    return isB(a) ? a : null;
}
function hasLegs(x) {
    return x && "number" == typeof x.legs;
}
function hasWings(x) {
    return x && !!x.wings;
}
function identifyBeast(beast) {
    hasLegs(beast) ? hasWings(beast) ? 4 === beast.legs ? log("pegasus - 4 legs, wings") : 2 === beast.legs ? log("bird - 2 legs, wings") : log("unknown - ".concat(beast.legs, " legs, wings")) : log("manbearpig - ".concat(beast.legs, " legs, no wings")) : hasWings(beast) ? log("quetzalcoatl - no legs, wings") : log("snake - no legs, no wings");
}
function beastFoo(beast) {
    hasWings(beast) && hasLegs(beast), hasLegs(beast) && hasWings(beast);
}
