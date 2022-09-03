//// [keyofAndIndexedAccess2.ts]
function f1(obj, k0, k1, k2) {
    obj[k0] = 1, obj[k0] = 2, obj[k0] = 'x', obj[k1] = 1, obj[k1] = 2, obj[k1] = 'x', obj[k2] = 1, obj[k2] = 2, obj[k2] = 'x';
}
function f2(a, b, c, k) {
    a = b, b = a = c, b = c, c = a, c = b, a.x, b.x, c.x, c[k], a.x = 1, b.x = 1, c.x = 1, c[k] = 1;
}
function f3(a, b, k) {
    b = a = b, a[k], a[k] = 1;
}
function f3b(a, b, k) {}
function f4(a, b) {}
function f10(obj, k1, k2, k3, k4) {
    obj[k1] = 123, obj[k2] = 123, obj[k3] = 123, obj[k4] = 123;
}
function f11(obj, k1, k2) {
    obj.foo = 123, obj[k1] = 123, obj[k2] = 123;
}
function f12(obj, k1, k2, k3) {
    obj.foo = 123, obj[k1] = 123, obj[k2] = 123, obj[k3] = 123;
}
export function getAllEntities(state) {
    let { ids , entities  } = state;
    return ids.map((id)=>entities[id]);
}
export function getEntity(id, state) {
    let { ids , entities  } = state;
    if (ids.includes(id)) return entities[id];
}
function get123() {
    return 123;
}
function fn(param, cb) {
    cb(param.elements[0]);
}
function fn2(param, cb) {
    cb(param[0]);
}
function fn3(param, cb) {
    cb(param[0]);
}
function fn4() {}
export class c {
    constructor(){
        this.a = "b", this.a = "b";
    }
}
let actions = [
    'resizeTo',
    'resizeBy'
];
for (let action of actions)window[action] = (x, y)=>{
    window[action](x, y);
};
