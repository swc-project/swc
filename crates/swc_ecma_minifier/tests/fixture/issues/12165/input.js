// 1. dead declarator + LIVE sibling, 2 assignments -> removed
let DEAD_WITH_LIVE_SIBLING = /* @__PURE__ */ function (E) {
    return E.a = 'DEAD_WITH_LIVE_SIBLING', E.b = 'DEAD_WITH_LIVE_SIBLING_2', E;
}({}), LIVE = /* @__PURE__ */ function (E) {
    return E.a = 'LIVE', E.b = 'y', E;
}({});

// 2. same IIFE, but no live sibling in the declaration -> removed
let DEAD_ALONE = /* @__PURE__ */ function (E) {
    return E.a = 'DEAD_ALONE', E.b = 'x', E;
}({});

// 3. same shape with a single assignment -> removed
let DEAD_ONE_ASSIGNMENT = /* @__PURE__ */ function (E) {
    return E.a = 'DEAD_ONE_ASSIGNMENT', E;
}({}), LIVE_ONE_ASSIGNMENT = /* @__PURE__ */ function (E) {
    return E.a = 'LIVE_ONE_ASSIGNMENT', E;
}({});

// A pure IIFE's arguments are still evaluated, even when its result is dead.
let DEAD_WITH_SIDE_EFFECT_ARG = /* @__PURE__ */ function (E) {
    return E;
}(console.log('SIDE_EFFECT_ARG'));

// A used pure IIFE must keep its return value and argument semantics.
let LIVE_PURE_RETURN = /* @__PURE__ */ function (E) {
    return E.value;
}({ value: 'LIVE_PURE_RETURN' });

// Without a pure annotation, this equivalent dead IIFE remains eligible for inlining.
let DEAD_WITHOUT_PURE = function (E) {
    return E.a = 'DEAD_WITHOUT_PURE', E;
}({});

// The sequence-specific arrow-IIFE fast path must honor the same annotation.
let LIVE_PURE_ARROW_IN_SEQUENCE = (console.log('ARROW_PREFIX'), /* @__PURE__ */ (() => 'LIVE_PURE_ARROW')());

// A dead pure IIFE nested in a sequence must be dropped without losing the prefix.
let DEAD_PURE_ARROW_IN_SEQUENCE = (console.log('DEAD_ARROW_PREFIX'), /* @__PURE__ */ (() => 'DEAD_ARROW_RESULT')());

console.log(LIVE.a, LIVE_ONE_ASSIGNMENT.a, LIVE_PURE_RETURN, LIVE_PURE_ARROW_IN_SEQUENCE);
