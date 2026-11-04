let connect = ()=>{
    function Comp() {
        const handleClick = ()=>{};
        return <h1 onClick={handleClick}>Hi</h1>;
    }
    return Comp;
};
function withRouter() {
    return function Child() {
        const handleClick = ()=>{};
        return <h1 onClick={handleClick}>Hi</h1>;
    };
}
;
