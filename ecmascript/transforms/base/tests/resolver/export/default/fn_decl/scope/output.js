export default function foo() {
    foo = function foo1(x) {
        return x === 0 ? 1 : 1 + foo1(x - 1);
    };
    return foo(10);
};
foo = 2;
