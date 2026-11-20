// Regex literals are lowered.
const literal = /[[a-z]--b]/v;

// The pass cannot tell whether a resolved `RegExp` is global, so the
// arguments are kept.
function run(RegExp) {
    return RegExp("[[a-z]--b]", "v");
}

// The flags of a call that may use the global `RegExp` replace the flags of
// the literal, so the literal is kept.
const replaced = RegExp(/[a&&b]/v, "u");
