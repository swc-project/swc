// @target: es6
foo({
    p: "",
    0: ()=>{},
    ["hi" + "bye"]: true,
    [0 + 1]: 0,
    [+"hi"]: [
        0
    ]
});
