export function Hello() {
    function handleClick() {}
    return <h1 onClick={handleClick}>Hi</h1>;
}
_c = Hello;
export default function Bar() {
    return <Hello/>;
}
_c1 = Bar;
function Baz() {
    return <h1>OK</h1>;
}
_c2 = Baz;
const NotAComp = 'hi';
export { Baz, NotAComp };
export function sum() {}
export const Bad = 42;
var _c, _c1, _c2;
$RefreshReg$(_c, "Hello");
$RefreshReg$(_c1, "Bar");
$RefreshReg$(_c2, "Baz");
