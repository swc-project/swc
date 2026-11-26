// Test: Arrow functions with unused default parameters
export const example = ()=>((a)=>a)(1) + ((a)=>a)(2) + ((a, b = 5)=>a + b)(3) + ((a, b = 1)=>a + b)(4);
