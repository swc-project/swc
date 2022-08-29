//// [computedPropertyNames52.js]
const array = [];
for(let i = 0; i < 10; ++i){
    let _i, _i1;
    var _C;
    array.push((_i = i, _i1 = i, _C = class C {
        constructor(){
            this[_i] = ()=>C;
        }
    }, _C[_i1] = 100, _C));
}
