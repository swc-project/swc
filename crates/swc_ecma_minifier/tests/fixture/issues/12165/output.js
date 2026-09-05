var E, E1;
// 1. dead declarator + LIVE sibling, 2 assignments -> removed
let LIVE = ((E = {}).a = 'LIVE', E.b = 'y', E), LIVE_ONE_ASSIGNMENT = ((E1 = {}).a = 'LIVE_ONE_ASSIGNMENT', E1);
console.log('SIDE_EFFECT_ARG');
// The sequence-specific arrow-IIFE fast path must honor the same annotation.
let LIVE_PURE_ARROW_IN_SEQUENCE = (console.log('ARROW_PREFIX'), 'LIVE_PURE_ARROW');
console.log('DEAD_ARROW_PREFIX'), console.log(LIVE.a, LIVE_ONE_ASSIGNMENT.a, 'LIVE_PURE_RETURN', LIVE_PURE_ARROW_IN_SEQUENCE);
