!(function(a, b, c) {
    console.log("a"[1 / 0], "b"["Infinity"]);
    console.log("c"[0 / 0], "d"["NaN"]);
    console.log("e"[void 0], "f"["undefined"]);
})(0, 0, 0);
