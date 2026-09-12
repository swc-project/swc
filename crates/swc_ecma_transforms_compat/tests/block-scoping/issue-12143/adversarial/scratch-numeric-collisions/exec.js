var _loop_init_0_ = function () {}, _loop_init_1_ = function () {};
var _loop_init_3_ = function () {}, _loop_init_5_ = function () {};

for (let i = 0, read = () => i; i < 1;) {
    console.log(_loop_init_0_.name, read());
    i = 42;
    console.log(read());
    break;
}
for (let i = 1, read = () => i; i < 2;) {
    console.log(_loop_init_1_.name, read());
    i = 42;
    console.log(read());
    break;
}
for (let i = 2, read = () => i; i < 3;) {
    console.log(_loop_init_3_.name, read());
    i = 42;
    console.log(read());
    break;
}
for (let i = 3, read = () => i; i < 4;) {
    console.log(_loop_init_5_.name, read());
    i = 42;
    console.log(read());
    break;
}
