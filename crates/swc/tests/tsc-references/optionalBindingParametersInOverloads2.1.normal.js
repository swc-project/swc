//// [optionalBindingParametersInOverloads2.ts]
function foo() {
    for(var _len = arguments.length, rest = new Array(_len), _key = 0; _key < _len; _key++){
        rest[_key] = arguments[_key];
    }
}
foo({
    x: "",
    y: 0,
    z: false
});
foo({
    x: false,
    y: 0,
    z: ""
});
