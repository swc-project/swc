export var loopError = function() {
    var stack = [
        1
    ];
    var _loop = function() {
        var object = 1;
        [].map(function() {
            return object;
        });
    };
    while(stack.shift() !== undefined)_loop();
    var kind = 0;
    switch(kind){
        case 0:
            break;
    }
};
