globalThis.evaluate = function() {
    let value;
    return eval('value = "eval"'), ()=>value || "FAIL";
}, console.log(globalThis.evaluate()());
