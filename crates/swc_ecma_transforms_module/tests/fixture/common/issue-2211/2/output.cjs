"use strict";
var _bar = require("./bar");
const makeX = ()=>{
    const _bar1 = ()=>(0, _bar.bar)();
    const alfa = ()=>_bar1();
    return {
        alfa
    };
};
