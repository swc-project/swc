System.register([], function(_export, _context) {
    "use strict";
    var i, item, x, y;
    function read() {
        return [
            x,
            y,
            i,
            item
        ];
    }
    _export("read", read);
    return {
        setters: [],
        execute: function() {
            if (flag) {
                x = init();
            }
            {
                y = 1;
            }
            for(i = 0; i < 1; i++);
            for(item in source);
        }
    };
});
