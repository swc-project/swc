define([
    "exports",
    "./bar"
], function(exports, _bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const makeX = ()=>{
        const _bar1 = ()=>(0, _bar.bar)();
        const alfa = ()=>_bar1();
        return {
            alfa
        };
    };
});
