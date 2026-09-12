var key = String.fromCharCode(95) + "loop_init_0_";
globalThis[key] = 73;
for (let i = 0, read = eval("(function () { return \\u{5f}loop_init_0_; })"); i < 1;) {
    console.log(read(), eval("\\u{00005f}loop_init_\\u{30}_"));
    break;
}
delete globalThis[key];
