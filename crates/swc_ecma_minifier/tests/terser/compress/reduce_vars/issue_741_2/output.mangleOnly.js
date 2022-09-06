var e = console.log;
var l = 0;
global.problem = () => {
    var r = l;
    e(r);
};
global.increment = () => {
    l++;
};
increment();
problem();
increment();
problem();
