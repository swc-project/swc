var a; // ok, same number of required params
a = ()=>1; // ok, same number of required params
a = (...args)=>1; // ok, same number of required params
a = (...args)=>1; // error, type mismatch
a = (x)=>1; // ok, same number of required params
a = (x, y, z)=>1; // ok, same number of required params
a = (x)=>1; // ok, rest param corresponds to infinite number of params
a = (x)=>1; // error, incompatible type
var a2;
a2 = ()=>1; // ok, fewer required params
a2 = (...args)=>1; // ok, fewer required params
a2 = (x)=>1; // ok, fewer required params
a2 = (x)=>1; // ok, same number of required params
a2 = (x, ...args)=>1; // ok, same number of required params
a2 = (x, ...args)=>1; // should be type mismatch error
a2 = (x, y)=>1; // ok, rest param corresponds to infinite number of params
a2 = (x, y)=>1; // ok, same number of required params
var a3;
a3 = ()=>1; // ok, fewer required params
a3 = (x)=>1; // ok, fewer required params
a3 = (x)=>1; // ok, same number of required params
a3 = (x, y)=>1; // ok, all present params match
a3 = (x, y, z)=>1; // error
a3 = (x, ...z)=>1; // error
a3 = (x, y, z)=>1; // error
var a4;
a4 = ()=>1; // ok, fewer required params
a4 = (x, y)=>1; // error, type mismatch
a4 = (x)=>1; // ok, all present params match
a4 = (x, y)=>1; // error, second param has type mismatch
a4 = (x, y)=>1; // ok, same number of required params with matching types
a4 = (x, ...args)=>1; // error, rest params have type mismatch
