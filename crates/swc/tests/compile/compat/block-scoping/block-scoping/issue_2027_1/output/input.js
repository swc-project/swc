var _loop = function(key) {
    controller[key] = (c, ...d)=>{
        console.log(keys[key]);
    };
};
var keys = {
    a: 1,
    b: 2
};
var controller = {};
for(var key in keys)_loop(key);
