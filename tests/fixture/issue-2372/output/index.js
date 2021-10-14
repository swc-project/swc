"use strict";
var _1 = require("./");
describe('example test that should fail due to compilation', ()=>{
    test.each([
        [
            'a',
            1,
            1,
            2
        ],
        [
            'b',
            2,
            2,
            4
        ], 
    ])('for entry %s', (_, a, b, expected)=>{
        const result = (0, _1).sum(a, b);
        expect(result).toEqual(expected);
    });
});
