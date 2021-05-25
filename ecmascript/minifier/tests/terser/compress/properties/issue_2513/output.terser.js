!(function (Infinity, NaN, undefined) {
    console.log("a"[1 / 0], "b"[1 / 0]);
    console.log("c".NaN, "d".NaN);
    console.log("e"[void 0], "f"[void 0]);
})(0, 0, 0);
