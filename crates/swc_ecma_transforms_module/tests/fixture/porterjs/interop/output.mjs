porter.define([
    "yen",
    "@cara/demo-component",
    "expect.js"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    const _yen = /*#__PURE__*/ _interopRequireDefault(require("yen"));
    require('@cara/demo-component');
    var expect = require('expect.js');
    describe('yen.fn.reveal()', function() {
        before(function() {
            (0, _yen.default)('#fixture').addClass('hidden');
        });
        it('removeClass("hidden")', function() {
            expect((0, _yen.default)('#fixture').reveal().hasClass('hidden')).to.be(false);
        });
    });
    describe('auto transpile es modules', function() {
        it('should be able to handle es module by default', async function() {
            const exports = await Promise.resolve().then(()=>/*#__PURE__*/ _interopRequireWildcard(require("./add")));
            expect(exports.default).to.be.a(Function);
        });
    });
});
