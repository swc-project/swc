//// [objectSpreadSetonlyAccessor.ts]
({
    ...{
        set bar (_v){}
    }
}), {
    ...{
        set foo (_v){}
    }
};
