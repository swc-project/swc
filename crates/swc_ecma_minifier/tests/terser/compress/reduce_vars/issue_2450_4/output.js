var a;
function g() {}
for(var i = 3; --i >= 0;)(function(b) {
    console.log(a === b);
    a = b;
})(g);
