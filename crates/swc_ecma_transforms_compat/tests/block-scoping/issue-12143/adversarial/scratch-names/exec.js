var _loop_init_ = function () {}, _loop_init__ = function () {};
for (let i = 0, read = () => i; i < 1;) {
    let _loop_init___ = () => i;
    console.log(_loop_init_.name, _loop_init__.name, _loop_init___.name);
    i = 42;
    console.log(read());
    break;
}
