function read() {
    for (let i = 0, f = () => eval("i"); i < 1;) {
        i = 42;
        console.log(f());
        break;
    }
}
function write() {
    for (let i = 0, set = function (code) { eval(code); }, get = () => eval("i"); i < 1;) {
        i = 42;
        set("i = 7");
        console.log(i, get());
        break;
    }
}
function dynamic() {
    for (let first = 1, second = 2, get = (name) => (eval)(name); first < 2;) {
        first = 11;
        second = 22;
        console.log(get("first"), get("second"));
        break;
    }
}
read();
write();
dynamic();
