let A = foo ? ()=>{
    return <h1>Hi</h1>;
} : null;
const B = function Foo() {
    return <h1>Hi</h1>;
}();
let C = ()=>()=>{
        return <h1>Hi</h1>;
    };
let D = bar && (()=>{
    return <h1>Hi</h1>;
});
