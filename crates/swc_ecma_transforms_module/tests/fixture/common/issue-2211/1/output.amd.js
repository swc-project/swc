define([
    "require",
    "./bar"
], function(require, _bar) {
    "use strict";
    const makeX = ()=>{
        const _bar1 = ()=>(0, _bar.bar)();
        return {
            _bar: _bar1
        };
    };
    makeX()._bar();
});
