//// [objectSpreadSetonlyAccessor.ts]
const o1 = {
    foo: 1,
    ...{
        set bar (_v){}
    }
}, o2 = {
    foo: 1,
    ...{
        set foo (_v){}
    }
};
