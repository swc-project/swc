globalThis.evaluate = function () {
    let value;
    eval('value = "eval"');
    return () => value ? value : "FAIL";
};
console.log(globalThis.evaluate()());
