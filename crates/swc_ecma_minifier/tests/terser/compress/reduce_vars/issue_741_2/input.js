var a = console.log;
var might_change = 0;
global.problem = () => {
    var c = might_change;
    a(c);
};
global.increment = () => {
    might_change++;
};
increment();
problem();
increment();
problem();
