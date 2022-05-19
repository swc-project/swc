var a, b;
function foo(a, b) {}
foo((x)=>1, (x)=>''), foo((x)=>null, (x)=>''), foo((x)=>1, (x)=>null), foo((x)=>1, (x)=>1), foo((x)=>a, (x)=>b), foo((x)=>b, (x)=>a);
