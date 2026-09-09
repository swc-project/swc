var calls = 0;
for (let i = 0, initial = () => i; i < 1; i++) {
    i = function () { return i; };
    with ({ set _loop_init_(value) { calls++; throw "intercepted"; } }) {
        console.log(i.name, i() === i, initial());
        break;
    }
}
console.log(calls);
