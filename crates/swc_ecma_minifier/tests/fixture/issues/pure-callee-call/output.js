let count = 0;
function invoke() {
    count += 1;
}
invoke(), /* @__PURE__ */ ((function(value) {
    return value;
})?.(invoke))(), /* @__PURE__ */ new function() {
    return invoke;
}()(), /* @__PURE__ */ (function() {
    return invoke;
})``(), console.log(count);
