(a)=>b
; // 1 args
(a, b)=>c
; // n args
()=>b
; // 0 args
(a)=>(b)=>c
; // func returns func returns func
(a)=>((b)=>c
    )
; // So these parens are dropped
()=>(b, c)=>d
; // func returns func returns func
(a)=>{
    return b;
};
(a)=>'e'
; // Dropping the parens
