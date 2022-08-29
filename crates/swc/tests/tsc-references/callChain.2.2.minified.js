//// [callChain.2.ts]
var ref;
null == o1 || o1(), null == o2 || o2.b(), null === (ref = o3.b) || void 0 === ref || ref.call(o3).c;
