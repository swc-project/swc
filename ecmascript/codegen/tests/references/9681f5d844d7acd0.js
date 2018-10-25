(// 1 argsa)=>b;
(// n argsa, // n argsb)=>c;
()=>b;
(// func returns func returns funca)=>(// func returns func returns funcb)=>c;
(// So these parens are droppeda)=>((// So these parens are droppedb)=>c);
()=>(// func returns func returns funcb, // func returns func returns funcc)=>d;
(a)=>{
    return b;
};
(// Dropping the parensa)=>'e';
