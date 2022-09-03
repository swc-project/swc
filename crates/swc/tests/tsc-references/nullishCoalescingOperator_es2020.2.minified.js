//// [nullishCoalescingOperator_es2020.ts]
const aa1 = a1 ?? 'whatever', aa2 = a2 ?? 'whatever', aa3 = a3 ?? 'whatever', aa4 = a4 ?? 'whatever', aa5 = a5 ?? 'whatever', aa6 = a6 ?? 'whatever', aa7 = a7 ?? 'whatever', aa8 = a8 ?? 'whatever', aa9 = a9 ?? 'whatever';
let x1 = (a ?? b) || c, x2 = c || (a ?? b), x3 = (a ?? b) || c, x4 = c || (a ?? b), x5 = (a ?? b) || c, x6 = c || (a ?? b), y1 = (a ?? b) && c, y2 = c && (a ?? b), y3 = (a ?? b) && c, y4 = c && (a ?? b), y5 = (a ?? b) && c, y6 = c && (a ?? b);
