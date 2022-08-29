//// [intersectionTypeInference3.ts]
// Repro from #19682
const c1 = Array.from(a).concat(Array.from(b));
const c2 = from();
