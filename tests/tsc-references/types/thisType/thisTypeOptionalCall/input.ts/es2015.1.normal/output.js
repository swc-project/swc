// @strictNullChecks: true
// @noImplicitAny: true
// @noImplicitThis: true
// @strictBindCallApply: false
function maybeBind(obj, fn) {
    return fn === null || fn === void 0 ? void 0 : fn.bind(obj);
}
