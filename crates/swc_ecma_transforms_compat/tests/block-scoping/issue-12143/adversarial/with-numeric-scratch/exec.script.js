var calls = 0;
with ({ set ["_" + "loop_init_0_"](value) { calls++; throw "initializer scratch"; } }) {
    for (let i = 0, initial = () => i; i < 1; i++) {
        i = function () { return i; };
        with ({ set ["_" + "loop_init_0_"](value) { calls++; throw "body scratch"; } }) {
            console.log(i.name, i() === i, initial());
            break;
        }
    }
}
console.log(calls);
