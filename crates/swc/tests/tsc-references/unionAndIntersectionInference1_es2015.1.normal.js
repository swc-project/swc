var y = undefined;
function destructure(something, haveValue, haveY) {
    return something === y ? haveY(y) : haveValue(something);
}
var value = Math.random() > 0.5 ? 'hey!' : undefined;
var result = destructure(value, (text)=>'string', (y)=>'other one'); // text: string, y: Y
// Repro from #4212
function isVoid(value) {
    return undefined;
}
function isNonVoid(value) {
    return undefined;
}
function foo1(value) {
    if (isVoid(value)) {
        value; // value is void
    } else {
        value; // value is a
    }
}
function baz1(value) {
    if (isNonVoid(value)) {
        value; // value is a
    } else {
        value; // value is void
    }
}
function get(x) {
    return null; // just an example
}
let foo;
get(foo).toUpperCase(); // Ok
pigify(mbp).oinks; // OK, mbp is treated as Pig
pigify(mbp).walks; // Ok, mbp is treated as Man
const createTestAsync = ()=>Promise.resolve().then(()=>({
            name: 'test'
        }));
const createTest = ()=>{
    return {
        name: 'test'
    };
};
let x1 = f1('a');
let x2 = f2('a', 'b');
// Repro from #30442
const func = ()=>{};
const assign = (a, b)=>Object.assign(a, b);
const res = assign(()=>{}, {
    func
});
