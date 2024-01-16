System.register([], function(_export, _context) {
    "use strict";
    return {
        setters: [],
        execute: function() {
            _export("default", ()=>{
                class Rectangle {
                    height = 0;
                    constructor(height, width){
                        this.height = height;
                        this.width = width;
                    }
                    incrementHeight() {
                        this.height = this.height + 1;
                    }
                }
            });
        }
    };
});
