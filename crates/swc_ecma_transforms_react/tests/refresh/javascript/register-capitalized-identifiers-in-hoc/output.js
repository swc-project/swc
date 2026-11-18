function Foo() {
    return <h1>Hi</h1>;
}
_c = Foo;
export default _c1 = hoc(Foo);
export const A = hoc(Foo);
_c2 = A;
const B = hoc(Foo);
_c3 = B;
var _c, _c1, _c2, _c3;
$RefreshReg$(_c, "Foo");
$RefreshReg$(_c1, "%default%");
$RefreshReg$(_c2, "A");
$RefreshReg$(_c3, "B");
