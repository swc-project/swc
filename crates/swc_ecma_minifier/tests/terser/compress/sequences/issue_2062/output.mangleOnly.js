var o = 1;
if ([o || o++ + o--, o++ + o--, o && o.var]);
console.log(o);
