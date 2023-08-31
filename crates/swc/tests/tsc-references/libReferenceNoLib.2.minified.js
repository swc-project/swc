//// [libReferenceNoLib.ts]
// Test that passing noLib disables <reference lib> resolution.
//// [fakelib.ts]
//// [file1.ts]
/// <reference lib="dom" />
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "elem", {
    enumerable: !0,
    get: function() {
        return elem;
    }
});
const elem = {
    field: 'a'
};
