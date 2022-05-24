var E, F, x;
function foo(x, a, b) {}
function foo2(x, a, b) {}
foo('', (x)=>'', (x)=>null), foo('', (x)=>'', (x)=>null), foo('', (x)=>'', (x)=>''), foo(null, (x)=>'', (x)=>''), foo(null, (x)=>'', (x)=>''), foo(new Object(), (x)=>'', (x)=>''), function(E) {
    E[E.A = 0] = "A";
}(E || (E = {})), function(F) {
    F[F.A = 0] = "A";
}(F || (F = {})), foo(E.A, (x)=>E.A, (x)=>F.A), foo2('', (x)=>'', (x)=>null), foo2(null, (x)=>'', (x)=>''), foo2(null, (x)=>'', (x)=>''), foo2(x, (a1)=>(n)=>1, (a2)=>2), foo2(x, (a1)=>(n)=>1, (a2)=>2);
