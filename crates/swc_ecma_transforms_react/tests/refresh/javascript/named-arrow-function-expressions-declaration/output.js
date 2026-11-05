let Hello = ()=>{
    const handleClick = ()=>{};
    return <h1 onClick={handleClick}>Hi</h1>;
};
_c = Hello;
const Bar = ()=>{
    return <Hello/>;
};
_c1 = Bar;
var Baz = ()=><div/>;
_c2 = Baz;
var sum = ()=>{};
var _c, _c1, _c2;
$RefreshReg$(_c, "Hello");
$RefreshReg$(_c1, "Bar");
$RefreshReg$(_c2, "Baz");
