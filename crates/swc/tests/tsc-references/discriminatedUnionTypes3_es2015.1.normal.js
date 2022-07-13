// @strict: true
// Repro from #44435
const example = {};
if (example.err === undefined) {
    example.property; // true
}
