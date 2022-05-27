var a = console.log;
var b = 0;
global.problem = ()=>{
    var c = b;
    a(c);
};
global.increment = ()=>{
    b++;
};
increment();
problem();
increment();
problem();
