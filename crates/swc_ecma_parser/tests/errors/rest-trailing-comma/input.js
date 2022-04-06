[...a,]=[...spread,];
const [...a,] = [...spread,];
([...a,],)=>{};
({...a,},)=>{};
(...a,)=>{};
class c {
  constructor(...a,){}
  fn(...a,) {}
}
function fn([...a,],) {};
function fn({...a,},) {};
function fn(...a,) {};
({...a,}={...spread,});
const {...a,} = {...spread,};
for ([...a,] of a) {}
for ({...a,} of b) {}
