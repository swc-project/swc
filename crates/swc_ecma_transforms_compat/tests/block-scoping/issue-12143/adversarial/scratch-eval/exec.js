globalThis["_loop_init_"] = 73;
for (let i = 0, read = eval("(function () { return _loop_init_; })"); i < 1;) {
    console.log(read(), eval("_loop_init_"));
    break;
}

for (let i = 0, read = () => i; i < 1;) {
    i = () => i;
    console.log(eval(`_loop_init_`), i.name, i() === i, read());
    break;
}
delete globalThis["_loop_init_"];
