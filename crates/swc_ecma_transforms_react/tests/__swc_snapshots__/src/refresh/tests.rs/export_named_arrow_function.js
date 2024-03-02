export const Hello = ()=>{
    function handleClick() {}
    return <h1 onClick={handleClick}>Hi</h1>;
};
_c = Hello;
export let Bar = (props)=><Hello/>;
_c1 = Bar;
export default (()=>{
    // This one should be ignored.
    // You should name your components.
    return <Hello/>;
});
var _c, _c1;
$RefreshReg$(_c, "Hello");
$RefreshReg$(_c1, "Bar");
