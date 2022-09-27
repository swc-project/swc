export default function foo__1() {
    foo__1 = function foo__2(x__3) {
        return x__3 === 0 ? 1 : 1 + foo__2(x__3 - 1);
    };
    return foo__1(10);
}
foo__1 = 2;
