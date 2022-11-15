export const fn = ()=>{
    let val;
    if (!!val) {
        if (val.a?.b !== !0) throw Error('second');
        return val;
    }
};
