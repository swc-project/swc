function identity(value) {
    return value;
}

let count = 0;

(/* @__PURE__ */ identity(function invoke() {
    count += 1;
}))();

console.log(count);
