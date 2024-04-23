//// [typeGuardIntersectionTypes.ts]
function f1(obj) {
    if (isX(obj) || isY(obj) || isZ(obj)) {
        obj;
    }
    if (isX(obj) && isY(obj) && isZ(obj)) {
        obj;
    }
}
// a type guard for B
function isB(toTest) {
    return toTest && toTest.b;
}
// a function that turns an A into an A & B
function union(a) {
    if (isB(a)) {
        return a;
    } else {
        return null;
    }
}
// Beast feature detection via user-defined type guards
function hasLegs(x) {
    return x && typeof x.legs === 'number';
}
function hasWings(x) {
    return x && !!x.wings;
}
// Function to identify a given beast by detecting its features
function identifyBeast(beast) {
    // All beasts with legs
    if (hasLegs(beast)) {
        // All winged beasts with legs
        if (hasWings(beast)) {
            if (beast.legs === 4) {
                log("pegasus - 4 legs, wings");
            } else if (beast.legs === 2) {
                log("bird - 2 legs, wings");
            } else {
                log("unknown - ".concat(beast.legs, " legs, wings"));
            }
        } else {
            log("manbearpig - ".concat(beast.legs, " legs, no wings"));
        }
    } else {
        if (hasWings(beast)) {
            log("quetzalcoatl - no legs, wings");
        } else {
            log("snake - no legs, no wings");
        }
    }
}
function beastFoo(beast) {
    if (hasWings(beast) && hasLegs(beast)) {
        beast; // Winged & Legged
    } else {
        beast;
    }
    if (hasLegs(beast) && hasWings(beast)) {
        beast; // Legged & Winged
    }
}
