// code below dont work
var _a;
var a = {};
new Promise(function(r) {
    var _a;
    r((_a = a) === null || _a === void 0 ? void 0 : _a.b);
}).then(function(a) {
    var _a;
    return (_a = a) === null || _a === void 0 ? void 0 : _a.b;
});
var anony = function() {
    var _a;
    return (_a = a) === null || _a === void 0 ? void 0 : _a.b;
};
// code below works
var b = (_a = a) === null || _a === void 0 ? void 0 : _a.b;
function fn() {
    var _a;
    return (_a = a) === null || _a === void 0 ? void 0 : _a.b;
}
setTimeout(function() {
    var _a;
    return (_a = a) === null || _a === void 0 ? void 0 : _a.b;
}, 0);
var anony2 = function anony2() {
    var _a;
    return (_a = a) === null || _a === void 0 ? void 0 : _a.b;
};
(function() {
    var _a;
    return (_a = a) === null || _a === void 0 ? void 0 : _a.b;
})();
