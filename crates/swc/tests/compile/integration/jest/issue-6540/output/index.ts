"use strict";
jest.mock("./foo").mock("./bar");
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _foo = /*#__PURE__*/ _interop_require_default._(require("./foo"));
test("Foo is a mock", ()=>{
    expect(jest.isMockFunction(_foo.default)).toBe(true);
});
