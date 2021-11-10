export default function foo() {
    foo = function foo__2(x__2) {
        return x__2 === 0 ? 1 : 1 + foo__2(x__2 - 1);
    };
    return foo(10);
};
foo = 2;
