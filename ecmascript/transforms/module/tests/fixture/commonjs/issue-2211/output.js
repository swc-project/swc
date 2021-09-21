"use strict";
var _bar1 = require("./bar");
const makeX = ()=>{
    const _bar = ()=>(0, _bar1).bar()
    ;
    return {
        _bar
    };
};
makeX()._bar();
