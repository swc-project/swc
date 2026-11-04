var _loop = function(i1) {
    console.log(i1++, [
        2
    ].every(function(x) {
        return x != i1;
    }));
    i = i1, void 0;
};
for(var i = 0; i < 5; i++)_loop(i);
