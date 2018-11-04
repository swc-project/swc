(a)=>b;
(// 1 args
(a, // 1 args
(a, b)=>// 1 args
(a, b) => c;
()=>// n args
() => b;
(// 0 args
(a)=>(// 0 args
(a) => (b)=>// 0 args
(a) => (b) => c;
(// func returns func returns func
(a)=>((// func returns func returns func
(a) => ((b)=>// func returns func returns func
(a) => ((b) => c);
()=>(// So these parens are dropped
() => (b, // So these parens are dropped
() => (b,c)=>// So these parens are dropped
() => (b,c) => d;
(// func returns func returns func
a)=>{
    return // func returns func returns func
a=>{return b;
};
(// func returns func returns func
a=>{return b;}
a)=>'e';
