// Test: Mixed used and unused parameters with defaults

// All params used
function allUsed(a, b = 10, c = 20) {
    return a + b + c;
}

// Only first param used, rest with defaults unused
function firstUsed(a, b = 10, c = 20, d = 30) {
    return a;
}

// Middle param unused
function middleUnused(a, b = 10, c = 20) {
    return a + c;
}

// First param unused (but not with default)
function firstParamUnused(a, b = 10, c = 20) {
    return b + c;
}

// Param with default used, regular param at end unused
// Note: trailing regular params after used default should be removable
function trailingUnused(a, b = 10, c) {
    return a + b;
}

// Rest parameter with default params before it
function withRest(a, b = 10, ...rest) {
    return a + rest.length;
}

export function example() {
    return allUsed(1) + firstUsed(2) + middleUnused(3) +
           firstParamUnused(4) + trailingUnused(5) + withRest(6);
}
