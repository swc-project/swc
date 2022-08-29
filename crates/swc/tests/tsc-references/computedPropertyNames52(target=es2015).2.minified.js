//// [computedPropertyNames52.js]
const array = [];
for(let i = 0; i < 10; ++i){
    var _C;
    let _i, _i1;
    array.push((_i = i, _i1 = i, _C = class C {
        constructor(){
            this[_i] = ()=>C;
        }
    }, _C[_i1] = 100, _C));
}
