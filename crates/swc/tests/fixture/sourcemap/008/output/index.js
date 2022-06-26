"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
describe("multiline comments", ()=>{
    it("test1", ()=>{
        expect(false).toBe(true);
    });
    it("test2", ()=>{
        /**/ expect(false).toBe(true);
    });
    it("test3", ()=>{
        /*
         *
         */ expect(false).toBe(true);
    });
    it("test4", ()=>{
        expect(false).toBe(true);
    });
});
