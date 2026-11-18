const effects = [];
function sideEffect(e) {
    effects.push(e);
}
function returned(e) {
    return function() {
        sideEffect(e);
    };
}
sideEffect("function-expression"), sideEffect("helper-call"), sideEffect("sequence"), returned("direct-call")(), /* @__PURE__ */ ((function(e) {
    return e;
})?.(returned("optional-call")))(), /* @__PURE__ */ new function(e) {
    return e;
}(returned("constructor"))(), /* @__PURE__ */ (function() {
    return returned("tagged-template");
})``(), console.log(effects.join(","));
