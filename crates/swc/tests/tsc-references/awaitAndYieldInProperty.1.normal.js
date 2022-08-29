//// [awaitAndYieldInProperty.ts]
async function* test(x) {
    let _ref, _ref1, _ref2, _ref3;
    var _class;
    let _ref4 = await x, _ref5 = await x, _ref6 = yield 1, _ref7 = yield 3;
    class C {
        constructor(){
            this[_ref4] = await x;
            this[_ref6] = yield 2;
        }
    }
    C[_ref5] = await x;
    C[_ref7] = yield 4;
    return _ref = await x, _ref1 = await x, _ref2 = yield 1, _ref3 = yield 3, _class = class {
        constructor(){
            this[_ref] = await x;
            this[_ref2] = yield 2;
        }
    }, _class[_ref1] = await x, _class[_ref3] = yield 4, _class;
}
