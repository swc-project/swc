//// [objectSpreadSetonlyAccessor.ts]
({
    foo: 1,
    ...{
        set foo (_v){}
    }
});
