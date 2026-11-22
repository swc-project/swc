// Regex literals are lowered.
const literal = /[ac-z]/u;
// The pass cannot tell whether a resolved `RegExp` is global, so the
// arguments are kept.
function run(RegExp) {
    return RegExp("[[a-z]--b]", "v");
}
