"use strict";
const _ = require("./");
describe("example test that should fail due to compilation", ()=>{
    test.each([
        [
            "a",
            1,
            1,
            2
        ],
        [
            "b",
            2,
            2,
            4
        ], 
    ])("for entry %s", (_1, a, b, expected)=>{
        const result = (0, _.sum)(a, b);
        expect(result).toEqual(expected);
    });
});
