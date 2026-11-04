// code below dont work
var a = {};
new Promise(function(r) {
    r(a === null || a === void 0 ? void 0 : a.b);
}).then(function(a) {
    return a === null || a === void 0 ? void 0 : a.b;
});
var anony = function anony() {
    return a === null || a === void 0 ? void 0 : a.b;
};
// code below works
var b = a === null || a === void 0 ? void 0 : a.b;
function fn() {
    return a === null || a === void 0 ? void 0 : a.b;
}
setTimeout(function() {
    return a === null || a === void 0 ? void 0 : a.b;
}, 0);
var anony2 = function anony2() {
    return a === null || a === void 0 ? void 0 : a.b;
};
(function() {
    return a === null || a === void 0 ? void 0 : a.b;
})();
