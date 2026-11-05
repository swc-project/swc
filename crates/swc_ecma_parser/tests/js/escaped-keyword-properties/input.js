import { br\u0065ak as imported } from "mod";
export { imported as br\u0065ak };

const object = {
    br\u{65}ak: 42,
    d\u0065fault() {},
    get cl\u0061ss() { return 42; },
};
object.br\u0065ak;
object?.br\u0065ak;
const { br\u0065ak: value } = object;

class A {
    st\u0061tic() {}
    static st\u0061tic = 42;
    br\u0065ak() {}
    d\u0065fault = 42;
    #br\u0065ak;
    method() { return this.#br\u0065ak; }
}
