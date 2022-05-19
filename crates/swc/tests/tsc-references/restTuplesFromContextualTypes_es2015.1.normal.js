(function(a, b, c) {})(...t1);
(function(...x) {})(...t1);
(function(a, ...x) {})(...t1);
(function(a, b, ...x) {})(...t1);
(function(a, b, c, ...x) {})(...t1);
f1((a, b, c)=>{});
f1((...x)=>{});
f1((a, ...x)=>{});
f1((a, b, ...x)=>{});
f1((a, b, c, ...x)=>{});
(function(a, b, c) {})(...t2);
(function(...x) {})(...t2);
(function(a, ...x) {})(...t2);
(function(a, b, ...x) {})(...t2);
(function(a, b, c, ...x) {})(...t2);
f2((a, b, c)=>{});
f2((...x)=>{});
f2((a, ...x)=>{});
f2((a, b, ...x)=>{});
f2((a, b, c, ...x)=>{});
(function(a, b, c) {})(1, ...t3);
(function(...x) {})(1, ...t3);
(function(a, ...x) {})(1, ...t3);
(function(a, b, ...x) {})(1, ...t3);
(function(a, b, c, ...x) {})(1, ...t3);
f3((a, b, c)=>{});
f3((...x)=>{});
f3((a, ...x)=>{});
f3((a, b, ...x)=>{});
f3((a, b, c, ...x)=>{});
function f4(t) {
    (function(...x) {})(...t);
    (function(a, ...x) {})(1, ...t);
    (function(a, ...x) {})(1, 2, ...t);
    function f(cb) {}
    f((...x)=>{});
    f((a, ...x)=>{});
    f((a, b, ...x)=>{});
}
let g0 = f5(()=>"hello");
let g1 = f5((x, y)=>42);
let g2 = f5((x, y)=>42);
let g3 = f5((x, y)=>x + y);
let g4 = f5((...args)=>true);
let g5 = pipe(()=>true, (b)=>42);
let g6 = pipe((x)=>"hello", (s)=>s.length);
let g7 = pipe((x, y)=>42, (x)=>"" + x);
let g8 = pipe((x, y)=>42, (x)=>"" + x);
(function foo(a, b) {})(...tuple);
(function foo(...rest) {})(1, '');
take(function(...rest) {});
const funcUnionTupleNoRest = (num, strOrErr)=>{
    return num;
};
const funcUnionTupleRest = (...params)=>{
    const [num, strOrErr] = params;
    return num;
};
