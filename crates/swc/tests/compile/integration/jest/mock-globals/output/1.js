"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _promises = require("node:timers/promises");
const _globals = require("@jest/globals");
_globals.jest.mock('timers/promises', ()=>({
        setTimeout: _globals.jest.fn(()=>Promise.resolve())
    }));
(0, _globals.describe)('suite', ()=>{
    (0, _globals.it)('my-test', ()=>{
        const totalDelay = _globals.jest.mocked(_promises.setTimeout).mock.calls.reduce((agg, call)=>agg + call[0], 0);
        (0, _globals.expect)(totalDelay).toStrictEqual(0);
    });
});
