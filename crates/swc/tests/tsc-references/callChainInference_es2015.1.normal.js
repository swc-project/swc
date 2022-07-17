// @strict: true
// Repro from #42404
if (value) {
    value === null || value === void 0 ? void 0 : value.foo("a");
}
value === null || value === void 0 ? void 0 : value.foo("a");
