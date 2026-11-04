// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _getstacktrace = require("common/get-stack-trace");
describe('get-stack-trace', ()=>{
    it("should include the calling function's name in third line", ()=>{
        let stack;
        function namedCallingFunction() {
            stack = (0, _getstacktrace.getStackTrace)();
        }
        namedCallingFunction();
        expect(stack[2]).toContain('namedCallingFunction');
    });
});
