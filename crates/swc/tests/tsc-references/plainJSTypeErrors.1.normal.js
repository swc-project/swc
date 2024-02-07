//// [plainJSTypeErrors.js]
// should error
if (({}) === {}) {}
// should not error
if (({}) == {}) {}
