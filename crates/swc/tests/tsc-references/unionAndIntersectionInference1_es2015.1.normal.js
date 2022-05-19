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
function foo1(value1) {
    if (isVoid(value1)) {
        value1; // value is void
    } else {
        value1; // value is a
    }
}
function baz1(value2) {
    if (isNonVoid(value2)) {
        value2; // value is a
    } else {
        value2; // value is void
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
