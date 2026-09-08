const effects = [];

function sideEffect(name) {
    effects.push(name);
}

function identity(value) {
    return value;
}

(/* @__PURE__ */ function () {
    sideEffect("function-expression");
})();

(/* @__PURE__ */ identity(function () {
    sideEffect("helper-call");
}))();

/* @__PURE__ */ (function () {
    sideEffect("whole-call");
})();

/* @__PURE__ */ (0, identity)(sideEffect("sequence"));

function returned(name) {
    return function () {
        sideEffect(name);
    };
}

(/* @__PURE__ */ identity(returned("direct-call")))();
(/* @__PURE__ */ identity?.(returned("optional-call")))();

function Factory(value) {
    return value;
}

(/* @__PURE__ */ new Factory(returned("constructor")))();

function tag() {
    return returned("tagged-template");
}

(/* @__PURE__ */ tag``)();

console.log(effects.join(","));
