System.register([], function(_export, _context) {
    "use strict";
    var A, a;
    return {
        setters: [],
        execute: function() {
            a = void 0;
            A = class A {
                constructor(){
                    this.a = 1;
                }
                test() {
                    this.a = 2;
                }
            };
        }
    };
});
