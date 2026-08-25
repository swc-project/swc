function identity(value) {
    return value;
}

let count = 0;
function invoke() {
    count += 1;
}

(/* @__PURE__ */ identity(invoke))();
(/* @__PURE__ */ identity?.(invoke))();

function Factory() {
    return invoke;
}
(/* @__PURE__ */ new Factory())();

function tag() {
    return invoke;
}
(/* @__PURE__ */ tag``)();
console.log(count);
