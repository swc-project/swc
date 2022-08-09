var _loop = function(i) {
    var j = Math.random();
    setTimeout(()=>console.log(j), 0);
};
for(var i = 0; i < 5; i++)_loop(i);
