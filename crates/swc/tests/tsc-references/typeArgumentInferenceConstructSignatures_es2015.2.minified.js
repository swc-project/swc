var noParams, noGenericParams, someGenerics1, someGenerics2a, someGenerics2b, someGenerics3, someGenerics4, someGenerics5, someGenerics6, someGenerics7, someGenerics9, anyVar;
new noParams(), new noParams(), new noParams(), new noGenericParams(''), new noGenericParams(''), new noGenericParams(''), new someGenerics1(3, 4), new someGenerics1(3, 4), new someGenerics1(3, 4), new someGenerics2a((n)=>n), new someGenerics2a((n)=>n), new someGenerics2a((n)=>n.substr(0)), new someGenerics2b((n, x)=>n), new someGenerics2b((n, t)=>n), new someGenerics2b((n, t)=>n.substr(t * t)), new someGenerics3(()=>''), new someGenerics3(()=>void 0), new someGenerics3(()=>3), new someGenerics4(4, ()=>null), new someGenerics4('', ()=>3), new someGenerics4('', (x)=>''), new someGenerics4(null, null), new someGenerics5(4, ()=>null), new someGenerics5('', ()=>3), new someGenerics5('', (x)=>''), new someGenerics5(null, null), new someGenerics6((n)=>n, (n)=>n, (n)=>n), new someGenerics6((n)=>n, (n)=>n, (n)=>n), new someGenerics6((n)=>n, (n)=>n, (n)=>n), new someGenerics6((n)=>n, (n)=>n, (n)=>n), new someGenerics7((n)=>n, (n)=>n, (n)=>n), new someGenerics7((n)=>n, (n)=>n, (n)=>n), new someGenerics7((n)=>n, (n)=>n, (n)=>n), new new (void 0)(someGenerics7)(null, null, null), new someGenerics9('', 0, []), new someGenerics9({
    a: 0
}, {
    b: ''
}, null), new someGenerics9(void 0, {
    x: 6,
    z: window
}, {
    x: 6,
    y: ''
}), new someGenerics9(void 0, {
    x: 6,
    z: window
}, {
    x: 6,
    y: ''
}), new someGenerics9({
    x: 3
}, {
    x: 6
}, {
    x: 6
}), new someGenerics9(7, anyVar, 4), new someGenerics9([], null, void 0);
