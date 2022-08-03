var r = console.log;
var a = 0;
global.problem = ()=>{
    var e = a;
    r(e);
};
global.increment = ()=>{
    a++;
};
increment();
problem();
increment();
problem();
