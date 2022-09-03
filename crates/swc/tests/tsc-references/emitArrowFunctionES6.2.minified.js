//// [emitArrowFunctionES6.ts]
var f1 = ()=>{}, f2 = (x, y)=>{}, f3 = (x, y, ...rest)=>{}, f4 = (x, y, z = 10)=>{};
function foo(func) {}
foo(()=>!0), foo(()=>!1);
var p1 = ([a])=>{}, p2 = ([...a])=>{}, p3 = ([, a])=>{}, p4 = ([, ...a])=>{}, p5 = ([a = 1])=>{}, p6 = ({ a  })=>{}, p7 = ({ a: { b  }  })=>{}, p8 = ({ a =1  })=>{}, p9 = ({ a: { b =1  } = {
    b: 1
}  })=>{}, p10 = ([{ value , done  }])=>{};
