"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _bar = require("./bar");
const makeX = ()=>{
    const _bar1 = ()=>(0, _bar.bar)();
    return {
        _bar: _bar1
    };
};
makeX()._bar();
