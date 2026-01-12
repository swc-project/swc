import { A } from "./a";
import { B } from "./b";
const { A: AB } = B;
const { CB = C } = B;
console.log(A, AB, CB);
