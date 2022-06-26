// @strict: true
// @target: esnext
function f1(obj, k0, k1, k2) {
    obj[k0] = 1;
    obj[k0] = 2;
    obj[k0] = 'x'; // Error
    obj[k1] = 1;
    obj[k1] = 2; // Error
    obj[k1] = 'x'; // Error
    obj[k2] = 1; // Error
    obj[k2] = 2; // Error
    obj[k2] = 'x'; // Error
}
function f2(a, b, c, k) {
    a = b; // Error, index signature in source doesn't imply properties are present
    a = c; // Error, index signature in source doesn't imply properties are present
    b = a;
    b = c;
    c = a; // Error, constraint on target doesn't imply any properties or signatures
    c = b; // Error, constraint on target doesn't imply any properties or signatures
    a.x;
    b.x;
    c.x;
    c[k];
    a.x = 1;
    b.x = 1;
    c.x = 1; // Error, cannot write to index signature through constraint
    c[k] = 1; // Error, cannot write to index signature through constraint
}
function f3(a, b, k) {
    a = b; // Error, index signature doesn't imply properties are present
    b = a;
    a[k];
    a[k] = 1;
}
function f3b(a, b, k) {
    a = b; // Error, index signature doesn't imply properties are present
    b = a;
}
function f4(a, b) {
    a = b;
    b = a;
}
function f10(obj, k1, k2, k3, k4) {
    obj[k1] = 123; // Error
    obj[k2] = 123; // Error
    obj[k3] = 123; // Error
    obj[k4] = 123; // Error
}
function f11(obj, k1, k2) {
    obj.foo = 123;
    obj[k1] = 123;
    obj[k2] = 123;
}
function f12(obj, k1, k2, k3) {
    obj.foo = 123; // Error
    obj[k1] = 123; // Error
    obj[k2] = 123; // Error
    obj[k3] = 123; // Error
}
export function getAllEntities(state) {
    const { ids , entities  } = state;
    return ids.map((id)=>entities[id]);
}
export function getEntity(id, state) {
    const { ids , entities  } = state;
    if (!ids.includes(id)) {
        return undefined;
    }
    return entities[id];
}
function get123() {
    return 123; // Error
}
// Repros from #30938
function fn(param, cb) {
    cb(param.elements[0]);
}
function fn2(param, cb) {
    cb(param[0]);
}
// Repro from #31149
function fn3(param, cb) {
    cb(param[0]);
}
function fn4() {
    let x = 'abc';
    let y = 'abc';
}
// Repro from #31439 and #31691
export class c {
    constructor(){
        this.a = "b";
        this["a"] = "b";
    }
}
// Repro from #32038
const actions = [
    'resizeTo',
    'resizeBy'
];
for (const action of actions){
    window[action] = (x, y)=>{
        window[action](x, y);
    };
}
