// ExportNamedDeclaration
var { b } = asdf2, c = _object_without_properties(asdf2, [
    "b"
]);
export { b, c };
// Skip
export var { bb, cc } = ads;
export var [dd, ee] = ads;
