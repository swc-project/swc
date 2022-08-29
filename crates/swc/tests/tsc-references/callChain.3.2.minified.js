//// [callChain.3.ts]
var ref, ref1, ref2, ref3, ref4;
null == a || null === (ref = a.m) || void 0 === ref || ref.call(a, {
    x: 12
}), null == a || null === (ref1 = a.m) || void 0 === ref1 || ref1.call(a, {
    x: absorb()
}), null == a || null === (ref2 = a.m) || void 0 === ref2 || ref2.call(a, {
    x: 12
}), null == a || null === (ref3 = a.m) || void 0 === ref3 || ref3.call(a, {
    x: absorb()
}), null == a || null === (ref4 = a.m) || void 0 === ref4 || ref4.call(a, {
    x: 12
}), a.m({
    x: 12
});
