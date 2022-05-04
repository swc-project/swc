// This is a minimal reproduction from lodash@4.17.21

function lodash(value) {
    console.log("lodash");
}

function memoize() {
    console.log("memoize");
}

lodash.memoize = memoize;

// Either of these lines cause this module
// not to be included in the bundle. Member expression
// on `module` or `exports`.
module.exports = lodash;
exports.memoize = memoize;

// NOTE: Indirection on `exports` will work
//const exporter = exports;
//exporter.memoize = memoize;
