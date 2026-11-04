export var loopError = function loopError() {
    var _loop = function() {
        var object = 1;
        [].map(function() {
            return object;
        });
    };
    var stack = [
        1
    ];
    while(stack.shift() !== undefined)_loop();
    var kind = 0;
    switch(kind){
        case 0:
            break;
    }
};
