//// [constructorNameInObjectLiteralAccessor.ts]
const c1 = {
    get constructor () {
        return;
    },
    set constructor (value){}
};
