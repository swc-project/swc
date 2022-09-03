//// [unionAndIntersectionInference1.ts]
var y = void 0;
function destructure(something, haveValue, haveY) {
    return something === y ? haveY(y) : haveValue(something);
}
var value = Math.random() > 0.5 ? 'hey!' : void 0, result = destructure(value, (text)=>'string', (y)=>'other one');
function isVoid(value) {}
function isNonVoid(value) {}
function foo1(value) {
    isVoid(value);
}
function baz1(value) {
    isNonVoid(value);
}
function get(x) {
    return null;
}
let foo;
get(foo).toUpperCase(), pigify(mbp).oinks, pigify(mbp).walks;
const createTestAsync = ()=>Promise.resolve().then(()=>({
            name: 'test'
        })), createTest = ()=>({
        name: 'test'
    });
let x1 = f1('a'), x2 = f2('a', 'b');
const func = ()=>{}, assign = (a, b)=>Object.assign(a, b), res = assign(()=>{}, {
    func
});
