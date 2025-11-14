// Issue #11255: compress.comparisons should not optimize comparisons with side effects
let PC = 0;
const Stack = [0, ''];
const Code = [0, 0, 1];
console.log(Stack[Code[++PC]] === Stack[Code[++PC]]);
