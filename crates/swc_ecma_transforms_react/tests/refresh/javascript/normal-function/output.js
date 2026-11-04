function Hello() {
    function handleClick() {}
    return <h1 onClick={handleClick}>Hi</h1>;
}
_c = Hello;
function Bar() {
    return <Hello/>;
}
_c1 = Bar;
var _c, _c1;
$RefreshReg$(_c, "Hello");
$RefreshReg$(_c1, "Bar");
